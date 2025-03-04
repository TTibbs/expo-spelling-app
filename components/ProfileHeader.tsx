import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useProfileData } from "@/hooks/useProfileData";

const ProfileHeader: React.FC = () => {
  const router = useRouter();
  const { userLevel, xp } = useProfileData();

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
