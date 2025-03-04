import { Stack } from "expo-router";
import BackButton from "../../components/BackButton";

export default function LearningLayout() {
  return (
    <Stack
      screenOptions={{
        headerLeft: () => <BackButton />,
      }}
    >
      <Stack.Screen
        name="words"
        options={{
          headerShown: true,
          title: "Spelling & Words",
          headerTintColor: "#6366F1",
          headerStyle: { backgroundColor: "#EEF2FF" },
        }}
      />
      <Stack.Screen
        name="numbers"
        options={{
          headerShown: true,
          title: "Numbers & Math",
          headerTintColor: "#10B981",
          headerStyle: { backgroundColor: "#ECFDF5" },
        }}
      />
      <Stack.Screen
        name="shapes"
        options={{
          headerShown: true,
          title: "Shapes",
          headerTintColor: "#F59E0B",
          headerStyle: { backgroundColor: "#FEF3C7" },
        }}
      />
      <Stack.Screen
        name="numbers/addition"
        options={{
          headerShown: true,
          title: "Addition",
          headerTintColor: "#10B981",
          headerStyle: { backgroundColor: "#ECFDF5" },
        }}
      />
      <Stack.Screen
        name="numbers/subtraction"
        options={{
          headerShown: true,
          title: "Subtraction",
          headerTintColor: "#10B981",
          headerStyle: { backgroundColor: "#ECFDF5" },
        }}
      />
      <Stack.Screen
        name="numbers/counting"
        options={{
          headerShown: true,
          title: "Counting",
          headerTintColor: "#10B981",
          headerStyle: { backgroundColor: "#ECFDF5" },
        }}
      />
      <Stack.Screen
        name="shapes/circles"
        options={{
          headerShown: true,
          title: "Circles & Ovals",
          headerTintColor: "#F59E0B",
          headerStyle: { backgroundColor: "#FEF3C7" },
        }}
      />
      <Stack.Screen
        name="shapes/squares"
        options={{
          headerShown: true,
          title: "Squares & Rectangles",
          headerTintColor: "#F59E0B",
          headerStyle: { backgroundColor: "#FEF3C7" },
        }}
      />
      <Stack.Screen
        name="shapes/triangles"
        options={{
          headerShown: true,
          title: "Triangles",
          headerTintColor: "#F59E0B",
          headerStyle: { backgroundColor: "#FEF3C7" },
        }}
      />
    </Stack>
  );
}
