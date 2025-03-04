import React from "react";
import { TouchableOpacity, Platform } from "react-native";
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
        marginLeft: 8,
        padding: 8,
        borderRadius: 8,
      }}
    >
      <Ionicons name="chevron-back" size={24} color={color} />
    </TouchableOpacity>
  );
}
