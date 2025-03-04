import React from "react";
import { View, Text } from "react-native";
import { PlayerLevel } from "@/types/common";

interface LevelProgressBarProps {
  currentLevel: PlayerLevel;
  nextLevel?: PlayerLevel;
  currentXP: number;
}

export const LevelProgressBar: React.FC<LevelProgressBarProps> = React.memo(
  ({ currentLevel, nextLevel, currentXP }) => {
    const xpForCurrentLevel = currentXP - (currentLevel?.minXp || 0);
    const xpRequiredForNextLevel = nextLevel
      ? nextLevel.minXp - (currentLevel?.minXp || 0)
      : 100;
    const progressPercentage = Math.min(
      (xpForCurrentLevel / Math.max(xpRequiredForNextLevel, 1)) * 100,
      100
    );

    return (
      <View className="mx-5 mb-5 bg-white p-4 rounded-xl shadow-sm">
        <View className="flex-row justify-between items-center mb-2">
          <Text className="text-base font-bold text-[#1E293B]">
            Level {currentLevel.id}: {currentLevel.title}
          </Text>
          <Text className="text-sm text-[#6366F1] font-bold">
            {currentXP} XP Total
          </Text>
        </View>

        <View className="h-3 bg-[#EEF2FF] rounded-full overflow-hidden mb-2">
          <View
            className="h-full bg-[#6366F1]"
            style={{ width: `${progressPercentage}%` }}
          />
        </View>

        {nextLevel ? (
          <Text className="text-xs text-[#64748B]">
            {xpForCurrentLevel} / {xpRequiredForNextLevel} XP to Level{" "}
            {nextLevel.id} ({nextLevel.title})
          </Text>
        ) : (
          <Text className="text-xs text-[#64748B]">
            Maximum level reached! Keep learning to maintain your skills.
          </Text>
        )}
      </View>
    );
  }
);
