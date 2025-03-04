import { Stack } from "expo-router";
import BackButton from "../../components/BackButton";
import { Platform } from "react-native";

export default function ProtectedLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerLeft: () => <BackButton />,
        headerTitleStyle: {
          fontWeight: Platform.OS === "android" ? "bold" : "normal",
        },
        headerBackVisible: false,
        animation: Platform.OS === "android" ? "slide_from_right" : "default",
        presentation: "card",
        gestureEnabled: Platform.OS === "ios",
        gestureDirection: "horizontal",
        animationTypeForReplace: "push",
        headerTitleAlign: Platform.OS === "android" ? "center" : "left",
      }}
    >
      <Stack.Screen
        name="settings"
        options={{
          title: "Settings",
          headerTintColor: "#6366F1",
          headerStyle: { backgroundColor: "#EEF2FF" },
        }}
      />
    </Stack>
  );
}
