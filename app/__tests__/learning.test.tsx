import { render } from "@testing-library/react-native";
import { ChildProvider } from "@/context/ChildContext";

import LearningScreen from "@/app/(tabs)/learning";

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

describe("<LearningScreen />", () => {
  test("renders all key components", () => {
    const { getByText } = render(
      <ChildProvider>
        <LearningScreen />
      </ChildProvider>
    );

    getByText("Adventures");
    getByText("Pick a path to start learning!");
    getByText("Unlock Your Potential!");
    getByText("Explore different subjects and earn XP as you learn");
    getByText("Spelling");
    getByText("Learn to spell words with fun pictures");
    getByText("Numbers");
    getByText("Count, add, subtract and more!");
    getByText("Shapes");
    getByText("Learn about different shapes and patterns");
    getByText("Memory Games");
    getByText("Test and improve your memory skills");
    getByText("Phonics");
    getByText(
      "Advanced sound recognition, blending, and comprehensive phonetic learning"
    );
    getByText("Reading");
    getByText("Read fun stories and answer questions");
  });
});
