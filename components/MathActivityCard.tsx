import React from "react";
import { View, Text } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

interface MathActivityCardProps {
  icon: string;
  iconColor: string;
  title: string;
  problems: number;
  accuracy: number;
}

export const MathActivityCard: React.FC<MathActivityCardProps> = React.memo(
  ({ icon, iconColor, title, problems, accuracy }) => (
    <View className="bg-white rounded-xl p-4 w-[48%] mb-4 shadow-sm">
      <View className="flex-row items-center mb-2">
        <View
          className="w-10 h-10 rounded-full justify-center items-center mr-2"
          style={{ backgroundColor: iconColor }}
        >
          <Ionicons name={icon as any} color={iconColor} size={20} />
        </View>
        <Text className="font-bold text-[#1E293B]">{title}</Text>
      </View>
      <View className="flex-row justify-between items-center">
        <Text className="text-xs text-[#64748B]">Problems</Text>
        <Text className="text-sm font-bold" style={{ color: iconColor }}>
          {problems}
        </Text>
      </View>
      <View className="flex-row justify-between items-center mt-1">
        <Text className="text-xs text-[#64748B]">Accuracy</Text>
        <Text className="text-sm font-bold" style={{ color: iconColor }}>
          {accuracy}%
        </Text>
      </View>
    </View>
  )
);
