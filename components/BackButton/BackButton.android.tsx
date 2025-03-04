import React from "react";
import { BackHandler } from "react-native";
import { useRouter, useNavigation } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { RectButton } from "react-native-gesture-handler";

interface BackButtonProps {
  onPress?: () => void;
  color?: string;
}

export default function BackButton({
  onPress,
  color = "#6366F1",
}: BackButtonProps) {
  const router = useRouter();
  const navigation = useNavigation();

  const handlePress = React.useCallback(() => {
    if (onPress) {
      onPress();
      return true;
    }

    try {
      if (navigation.canGoBack()) {
        navigation.goBack();
        return true;
      }

      router.back();
      return true;
    } catch (error) {
      console.warn("Navigation error:", error);
      // Fallback to router.back() if navigation fails
      router.back();
      return true;
    }
  }, [onPress, navigation, router]);

  // Add hardware back button handler
  React.useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      handlePress
    );

    return () => backHandler.remove();
  }, [handlePress]);

  return (
    <RectButton
      onPress={handlePress}
      style={{
        marginLeft: 16,
        padding: 8,
        borderRadius: 8,
        minWidth: 48, // Increased touch target size
        minHeight: 48, // Increased touch target size
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Ionicons name="arrow-back" size={24} color={color} />
    </RectButton>
  );
}
