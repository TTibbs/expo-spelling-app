import { Stack } from "expo-router";
import BackButton from "../../components/BackButton";
import { Platform } from "react-native";

export default function LearningLayout() {
  return (
    <Stack
      screenOptions={{
        headerLeft: () => <BackButton />,
        headerShown: true,
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
        name="words"
        options={{
          title: "Spelling & Words",
          headerTintColor: "#6366F1",
          headerStyle: { backgroundColor: "#EEF2FF" },
        }}
      />
      <Stack.Screen
        name="numbers"
        options={{
          title: "Numbers & Math",
          headerTintColor: "#10B981",
          headerStyle: { backgroundColor: "#ECFDF5" },
        }}
      />
      <Stack.Screen
        name="shapes"
        options={{
          title: "Shapes",
          headerTintColor: "#F59E0B",
          headerStyle: { backgroundColor: "#FEF3C7" },
        }}
      />
      <Stack.Screen
        name="numbers/addition"
        options={{
          title: "Addition",
          headerTintColor: "#10B981",
          headerStyle: { backgroundColor: "#ECFDF5" },
        }}
      />
      <Stack.Screen
        name="numbers/subtraction"
        options={{
          title: "Subtraction",
          headerTintColor: "#10B981",
          headerStyle: { backgroundColor: "#ECFDF5" },
        }}
      />
      <Stack.Screen
        name="numbers/counting"
        options={{
          title: "Counting",
          headerTintColor: "#10B981",
          headerStyle: { backgroundColor: "#ECFDF5" },
        }}
      />
      <Stack.Screen
        name="shapes/circles"
        options={{
          title: "Circles & Ovals",
          headerTintColor: "#F59E0B",
          headerStyle: { backgroundColor: "#FEF3C7" },
        }}
      />
      <Stack.Screen
        name="shapes/squares"
        options={{
          title: "Squares & Rectangles",
          headerTintColor: "#F59E0B",
          headerStyle: { backgroundColor: "#FEF3C7" },
        }}
      />
      <Stack.Screen
        name="shapes/triangles"
        options={{
          title: "Triangles",
          headerTintColor: "#F59E0B",
          headerStyle: { backgroundColor: "#FEF3C7" },
        }}
      />
    </Stack>
  );
}
