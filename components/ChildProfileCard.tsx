import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { ChildProfile } from "@/types/common";

interface ChildProfileCardProps {
  child: ChildProfile;
  isActive: boolean;
  onPress: (child: ChildProfile) => void;
}

export const ChildProfileCard: React.FC<ChildProfileCardProps> = React.memo(
  ({ child, isActive, onPress }) => (
    <TouchableOpacity
      className={`bg-white rounded-xl p-4 mr-3 w-40 shadow-sm ${
        isActive ? "border-2 border-[#6366F1]" : ""
      }`}
      onPress={() => onPress(child)}
    >
      <View className="w-12 h-12 rounded-full bg-[#EEF2FF] justify-center items-center mb-2">
        <Ionicons name="person" color="#6366F1" size={24} />
      </View>
      <Text className="font-bold text-[#1E293B] mb-1">{child.name}</Text>
      <Text className="text-xs text-[#64748B]">Level {child.level}</Text>
      <Text className="text-xs text-[#64748B]">{child.xp} XP</Text>
    </TouchableOpacity>
  )
);
