import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter } from "expo-router";

interface EmptyStateProps {
  type: "spelling" | "math";
}

export const EmptyState: React.FC<EmptyStateProps> = React.memo(({ type }) => {
  const router = useRouter();

  const config = {
    spelling: {
      icon: "book-outline",
      color: "#6366F1",
      title: "No Words Learned Yet",
      message: "Start playing to add words to your collection!",
      buttonText: "Start Learning",
      route: "/learning/words" as const,
    },
    math: {
      icon: "calculator-outline",
      color: "#10B981",
      title: "No Math Progress Yet",
      message: "Start solving math problems to see your progress!",
      buttonText: "Start Math",
      route: "/learning/numbers" as const,
    },
  };

  const { icon, color, title, message, buttonText, route } = config[type];

  return (
    <View className="items-center justify-center py-10">
      <Ionicons name={icon as any} color="#CBD5E1" size={60} />
      <Text className="text-lg font-bold text-[#1E293B] mt-4 mb-2">
        {title}
      </Text>
      <Text className="text-sm text-[#64748B] text-center mb-5 px-5">
        {message}
      </Text>
      <TouchableOpacity
        className="py-3 px-6 rounded-lg"
        style={{ backgroundColor: color }}
        onPress={() => router.push(route)}
      >
        <Text className="text-white font-bold text-base">{buttonText}</Text>
      </TouchableOpacity>
    </View>
  );
});
