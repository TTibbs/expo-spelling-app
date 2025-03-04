import React from "react";
import { View, Text } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

interface StatsCardProps {
  icon: string;
  iconColor: string;
  value: string | number;
  label: string;
}

export const StatsCard: React.FC<StatsCardProps> = React.memo(
  ({ icon, iconColor, value, label }) => (
    <View className="bg-white rounded-xl p-4 items-center w-[30%] shadow-sm">
      <View
        className="w-10 h-10 rounded-full justify-center items-center mb-2"
        style={{ backgroundColor: iconColor }}
      >
        <Ionicons name={icon as any} color={iconColor} size={20} />
      </View>
      <Text className="text-lg font-bold text-[#1E293B] mb-1">{value}</Text>
      <Text className="text-xs text-[#64748B] text-center">{label}</Text>
    </View>
  )
);
