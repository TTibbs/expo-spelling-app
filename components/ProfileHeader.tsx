import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useChild } from "@/context/ChildContext";
import { loadUserProfile } from "@/lib/storage";

const ProfileHeader: React.FC = () => {
  const router = useRouter();
  const { activeChild, isLoading: isChildLoading } = useChild();
  const [userLevel, setUserLevel] = useState<string>("1");
  const [xp, setXp] = useState<number>(0);

  // Load user profile data
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        // Use the centralized loadUserProfile function to get a validated profile
        const profile = await loadUserProfile();
        setUserLevel(activeChild ? activeChild.level : profile.level);
        setXp(activeChild ? activeChild.xp : profile.xp);
      } catch (error) {
        console.error(
          "Failed to load user profile:",
          error instanceof Error ? error.message : "Unknown error"
        );
      }
    };

    fetchUserProfile();
  }, [activeChild]);

  return (
    <View className="flex-row justify-between items-center px-5 pt-3 pb-1">
      <Text className="text-2xl font-bold text-[#1E293B]">My Chores</Text>

      {/* Add profile button */}
      <TouchableOpacity
        className="bg-[#EEF2FF] p-2 rounded-xl"
        onPress={() => router.push("/profile")}
      >
        <View className="flex-row items-center">
          <Ionicons name="star" color="#6366F1" size={18} />
          <Text className="ml-1 font-bold text-[#6366F1]">
            Level {userLevel}
          </Text>
        </View>
        <Text className="text-xs text-[#64748B] text-center mt-1">{xp} XP</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ProfileHeader;
