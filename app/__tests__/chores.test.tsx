import { render, fireEvent } from "@testing-library/react-native";
import { ChildProvider } from "@/context/ChildContext";

import ChoresScreen from "@/app/(tabs)/chores";

jest.mock("expo-router", () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
  }),
  usePathname: () => "/",
  useFocusEffect: jest.fn(),
}));

jest.mock("expo-font", () => ({
  loadAsync: jest.fn(),
  isLoaded: jest.fn(() => true),
  isLoading: jest.fn(() => false),
  processFontFamily: jest.fn((font) => font),
}));

describe("<ChoresScreen />", () => {
  test("renders all key components", () => {
    const { getByText } = render(
      <ChildProvider>
        <ChoresScreen />
      </ChildProvider>
    );

    getByText("Welcome to Chores! 🧹");
    getByText(
      "Select a category to see available chores. Complete them to earn XP and rewards!"
    );
  });

  test("adds a chore to the list", () => {
    const { getByTestId, getByText } = render(
      <ChildProvider>
        <ChoresScreen />
      </ChildProvider>
    );

    // Open the dropdown
    const dropdownButton = getByTestId("chore-dropdown-chore-dropdown-button");
    fireEvent.press(dropdownButton);

    // Add a chore
    const choreItem = getByTestId("chore-dropdown-chore-item-make-bed");
    fireEvent.press(choreItem);

    // Verify that the feedback message is displayed
    expect(getByText("Added: Make Bed")).toBeTruthy();
  });

  test("removes a chore from the list", () => {
    const { getByText, getByTestId } = render(
      <ChildProvider>
        <ChoresScreen />
      </ChildProvider>
    );

    // Open the dropdown
    const dropdownButton = getByTestId("chore-dropdown-chore-dropdown-button");
    fireEvent.press(dropdownButton);

    // Add a chore
    const choreItemToAdd = getByTestId("chore-dropdown-chore-item-make-bed");
    fireEvent.press(choreItemToAdd);

    // Now remove the chore
    const removeButton = getByTestId("remove-chore-make-bed");
    fireEvent.press(removeButton);

    // Verify that the feedback message is displayed
    expect(getByText("Removed: Make Bed")).toBeTruthy();
  });
});
