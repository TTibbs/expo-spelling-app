import React from "react";
import { TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

interface BackButtonProps {
  onPress?: () => void;
  color?: string;
}

export default function BackButton({
  onPress,
  color = "#6366F1",
}: BackButtonProps) {
  const router = useRouter();

  const handlePress = () => {
    if (onPress) {
      onPress();
    } else {
      router.back();
    }
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      style={{
        marginLeft: 16,
        padding: 8,
        borderRadius: 8,
        minWidth: 40,
        minHeight: 40,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Ionicons name="arrow-back" size={24} color={color} />
    </TouchableOpacity>
  );
}
