import { render, fireEvent } from "@testing-library/react-native";
import { ChildProvider } from "@/context/ChildContext";
import HomeScreen from "@/app/(tabs)/index";

// Import the mocked useRouter
import { useRouter } from "expo-router";

jest.mock("expo-router", () => {
  const push = jest.fn();
  return {
    useRouter: jest.fn(() => ({
      push,
      replace: jest.fn(),
      back: jest.fn(),
    })),
    usePathname: () => "/",
    useFocusEffect: jest.fn(),
  };
});

jest.mock("expo-font", () => ({
  loadAsync: jest.fn(),
  isLoaded: jest.fn(() => true),
  isLoading: jest.fn(() => false),
  processFontFamily: jest.fn((font) => font),
}));

describe("<HomeScreen />", () => {
  test("renders all key components", () => {
    const { getByText } = render(
      <ChildProvider>
        <HomeScreen />
      </ChildProvider>
    );

    getByText("Hey there! 👋");
    getByText("Ready for some fun learning?");
    getByText("Unlock all learning adventures!");
    getByText("Start Learning");
    getByText("Pick your adventure! ✨");
    getByText("Discover More! 🎯");
    getByText("See All");
    getByText("Power Up Your Mind!");
    getByText(
      "Every new word you learn creates new connections in your brain. Let's make your brain super strong! 🧠✨"
    );
    getByText("Unlock Achievements!");
    getByText(
      "Complete challenges to earn special badges and watch your progress soar to new heights! 🏆"
    );
    getByText("Earn Cool Rewards!");
    getByText(
      "Turn your learning adventures into awesome rewards! What will you unlock next? 🎁"
    );
  });

  test("navigates to learning page on banner press", () => {
    const { getByText } = render(
      <ChildProvider>
        <HomeScreen />
      </ChildProvider>
    );

    const startLearningButton = getByText("Start Learning");
    fireEvent.press(startLearningButton);

    // Access the mocked useRouter function
    const router = useRouter();
    expect(router.push).toHaveBeenCalledWith("/learning");
  });
});
