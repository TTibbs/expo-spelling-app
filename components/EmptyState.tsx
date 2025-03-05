import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter } from "expo-router";

interface EmptyStateProps {
  type: "spelling" | "math" | "shapes";
}

export const EmptyState: React.FC<EmptyStateProps> = React.memo(({ type }) => {
  const router = useRouter();

  const getContent = () => {
    switch (type) {
      case "spelling":
        return {
          icon: "book-outline",
          color: "#6366F1",
          title: "No Words Learned Yet",
          message: "Start learning new words to see them here!",
          buttonText: "Start Learning",
          route: "/learning/words" as const,
        };
      case "math":
        return {
          icon: "calculator-outline",
          color: "#10B981",
          title: "No Math Progress Yet",
          message: "Complete math problems to see your progress!",
          buttonText: "Start Math",
          route: "/learning/numbers" as const,
        };
      case "shapes":
        return {
          icon: "shapes-outline",
          color: "#3B82F6",
          title: "No Shapes Progress Yet",
          message: "Learn about shapes to see your progress here!",
          buttonText: "Start Learning",
          route: "/learning/shapes" as const,
        };
    }
  };

  const content = getContent();

  return (
    <View className="items-center justify-center py-10">
      <View
        className="w-16 h-16 rounded-full justify-center items-center mb-4"
        style={{ backgroundColor: `${content.color}20` }}
      >
        <Ionicons name={content.icon as any} size={32} color={content.color} />
      </View>
      <Text className="text-lg font-bold text-slate-800 mb-2">
        {content.title}
      </Text>
      <Text className="text-sm text-slate-500 text-center">
        {content.message}
      </Text>
      <TouchableOpacity
        className="py-3 px-6 rounded-lg"
        style={{ backgroundColor: content.color }}
        onPress={() => router.push(content.route)}
      >
        <Text className="text-white font-bold text-base">
          {content.buttonText}
        </Text>
      </TouchableOpacity>
    </View>
  );
});
