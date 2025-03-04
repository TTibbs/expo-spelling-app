import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter, usePathname } from "expo-router";
import { useProfileData } from "@/hooks/useProfileData";
import { useChild } from "@/context/ChildContext";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  showProfileBadge?: boolean;
  rightElement?: React.ReactNode;
  onProfilePress?: () => void;
}

const ProfileBadge: React.FC<{
  level: string;
  xp: number;
  onPress: () => void;
}> = React.memo(({ level, xp, onPress }) => (
  <TouchableOpacity className="bg-[#EEF2FF] p-2 rounded-xl" onPress={onPress}>
    <View className="flex-row items-center">
      <Ionicons name="star" color="#6366F1" size={18} />
      <Text className="ml-1 font-bold text-[#6366F1]">Level {level}</Text>
    </View>
    <Text className="text-xs text-[#64748B] text-center mt-1">{xp} XP</Text>
  </TouchableOpacity>
));

export const PageHeader: React.FC<PageHeaderProps> = React.memo(
  ({
    title,
    subtitle,
    showProfileBadge = true,
    rightElement,
    onProfilePress,
  }) => {
    const router = useRouter();
    const pathname = usePathname();
    const { activeChild } = useChild();
    const { userLevel, xp } = useProfileData();

    const handleProfilePress = React.useCallback(() => {
      if (onProfilePress) {
        onProfilePress();
      } else {
        router.push("/profile");
      }
    }, [onProfilePress, router]);

    // Hide profile badge on profile screen
    const shouldShowProfileBadge = showProfileBadge && pathname !== "/profile";

    return (
      <View className="px-5 pt-5 pb-2.5 flex-row justify-between items-center">
        <View>
          <Text className="text-2xl font-bold text-[#1E293B]">{title}</Text>
          {subtitle && (
            <Text className="text-base text-[#64748B] mt-1.5">{subtitle}</Text>
          )}
        </View>
        {shouldShowProfileBadge && (
          <ProfileBadge
            level={userLevel}
            xp={xp}
            onPress={handleProfilePress}
          />
        )}
        {rightElement}
      </View>
    );
  }
);
