import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter } from "expo-router";
import { MathStats as MathStatsType } from "@/types/numbers";
import { MathActivityCard } from "./MathActivityCard";

interface MathStatsProps {
  stats: MathStatsType;
}

export const MathStats: React.FC<MathStatsProps> = React.memo(({ stats }) => {
  const router = useRouter();
  const accuracy =
    stats.totalProblems > 0
      ? Math.round((stats.correctAnswers / stats.totalProblems) * 100)
      : 0;

  return (
    <View className="flex-1">
      {/* Math activity cards */}
      <View className="flex-row flex-wrap justify-between">
        <MathActivityCard
          icon="add-circle-outline"
          iconColor="#ECFDF5"
          title="Addition"
          problems={stats.addition.attempted}
          accuracy={stats.addition.accuracy}
        />
        <MathActivityCard
          icon="remove-circle-outline"
          iconColor="#FEF3C7"
          title="Subtraction"
          problems={stats.subtraction.attempted}
          accuracy={stats.subtraction.accuracy}
        />
        <MathActivityCard
          icon="list-outline"
          iconColor="#EDE9FE"
          title="Counting"
          problems={stats.counting.attempted}
          accuracy={stats.counting.accuracy}
        />
        <MathActivityCard
          icon="stats-chart-outline"
          iconColor="#EEF2FF"
          title="Overall"
          problems={stats.totalProblems}
          accuracy={accuracy}
        />
      </View>

      {/* Streak badge */}
      <View className="bg-white rounded-xl p-4 shadow-sm mb-4">
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center">
            <Ionicons name="flame" size={20} color="#EF4444" />
            <Text className="text-base font-bold text-[#1E293B] ml-2">
              Highest Streak
            </Text>
          </View>
          <Text className="text-xl font-bold text-[#EF4444]">
            {stats.highestStreak}
          </Text>
        </View>
        <Text className="text-xs text-[#64748B] mt-1">
          Your best sequence of correct answers in a row!
        </Text>
      </View>

      {/* Start math button */}
      <TouchableOpacity
        className="bg-[#10B981] py-4 rounded-xl items-center"
        onPress={() => router.push("/learning/numbers" as const)}
      >
        <Text className="text-white font-bold text-base">
          Continue Math Adventure
        </Text>
      </TouchableOpacity>
    </View>
  );
});
