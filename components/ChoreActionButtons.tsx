import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { ChoreActionButtonsProps } from "@/types/common";

const ChoreActionButtons: React.FC<ChoreActionButtonsProps> = ({
  assignedChores,
  resetChores,
  completeAllChores,
  calculateTotalXp,
}) => {
  return (
    <View className="flex-row justify-between mb-5">
      <TouchableOpacity
        className="bg-[#F1F5F9] py-2 px-4 rounded-lg"
        onPress={resetChores}
      >
        <Text className="text-[#64748B] font-medium">Reset</Text>
      </TouchableOpacity>

      <TouchableOpacity
        className={`py-2 px-4 rounded-lg ${
          assignedChores.length > 0 ? "bg-[#6366F1]" : "bg-[#CBD5E1]"
        }`}
        onPress={completeAllChores}
        disabled={assignedChores.length === 0}
      >
        <Text className="text-white font-medium">
          Complete {assignedChores.length > 0 && `(${calculateTotalXp()} XP)`}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default ChoreActionButtons;
