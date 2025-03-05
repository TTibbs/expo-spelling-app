import React, { useState, useEffect, useCallback } from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter, useFocusEffect } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import { PageHeader } from "@/components/PageHeader";
import { useChild } from "@/context/ChildContext";
import { getRewardProgress } from "@/lib/storage";
import { RewardProgress, Reward } from "@/types/common";
import {
  getAvailableRewards,
  getSpecialRewards,
  getCompletedRewards,
  initializeRewardProgress,
} from "@/lib/utils";

const RewardCard: React.FC<{
  reward: Reward;
  progress?: number;
  isLocked?: boolean;
  onPress: () => void;
}> = ({ reward, progress = 0, isLocked = false, onPress }) => (
  <TouchableOpacity
    className="bg-white rounded-xl p-4 mb-3 shadow-sm"
    onPress={onPress}
  >
    <View className="flex-row items-center justify-between">
      <View className="flex-row items-center flex-1">
        <View
          className="w-12 h-12 rounded-xl items-center justify-center mr-3"
          style={{ backgroundColor: `${reward.color}20` }}
        >
          <Ionicons name={reward.icon as any} size={24} color={reward.color} />
        </View>
        <View className="flex-1">
          <Text className="text-base font-bold text-[#1E293B] mb-1">
            {reward.title}
          </Text>
          <Text className="text-sm text-[#64748B]">{reward.description}</Text>
          {!isLocked && (
            <View className="h-1 bg-gray-100 rounded-full overflow-hidden mt-2">
              <View
                className="h-full bg-emerald-500 rounded-full"
                style={{ width: `${progress}%` }}
              />
            </View>
          )}
        </View>
      </View>
      <View className="items-end">
        {isLocked ? (
          <Ionicons name="lock-closed" size={20} color="#94A3B8" />
        ) : (
          <View className="flex-row items-center">
            <Text className="font-bold text-[#6366F1] mr-1">
              {reward.points}
            </Text>
            <Ionicons name="star" size={16} color="#6366F1" />
          </View>
        )}
      </View>
    </View>
  </TouchableOpacity>
);

const ProgressSection: React.FC<{
  title: string;
  current: number;
  total: number;
  color: string;
}> = ({ title, current, total, color }) => (
  <View className="bg-white rounded-xl p-4 mb-4">
    <Text className="text-base font-bold text-[#1E293B] mb-2">{title}</Text>
    <View className="h-2 bg-gray-100 rounded-full overflow-hidden">
      <View
        className="h-full rounded-full"
        style={{
          backgroundColor: color,
          width: `${(current / total) * 100}%`,
        }}
      />
    </View>
    <Text className="text-sm text-[#64748B] mt-2">
      {current} / {total} points
    </Text>
  </View>
);

export default function RewardsScreen() {
  const router = useRouter();
  const { activeChild } = useChild();
  const [rewardProgress, setRewardProgress] = useState<RewardProgress>(() =>
    initializeRewardProgress(activeChild?.id || "default")
  );
  const [availableRewards, setAvailableRewards] = useState<Reward[]>([]);
  const [specialRewards, setSpecialRewards] = useState<Reward[]>([]);
  const [completedRewards, setCompletedRewards] = useState<Reward[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadRewardProgress = useCallback(async () => {
    try {
      setIsLoading(true);
      const progress = await getRewardProgress(activeChild?.id);

      // If no progress exists, use the initialized default state
      const currentProgress =
        progress || initializeRewardProgress(activeChild?.id || "default");

      setRewardProgress(currentProgress);
      setAvailableRewards(getAvailableRewards(currentProgress));
      setSpecialRewards(getSpecialRewards(currentProgress));
      setCompletedRewards(getCompletedRewards(currentProgress));
    } catch (error) {
      console.error("Error loading reward progress:", error);
    } finally {
      setIsLoading(false);
    }
  }, [activeChild?.id]);

  // Load initial data
  useEffect(() => {
    loadRewardProgress();
  }, [loadRewardProgress]);

  // Refresh data when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      loadRewardProgress();
    }, [loadRewardProgress])
  );

  const handleRewardPress = (rewardId: string) => {
    // Show reward details or requirements
    console.log("Reward pressed:", rewardId);
  };

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-[#F9F9F9] justify-center items-center">
        <Text>Loading rewards...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-[#F9F9F9]">
      <ScrollView className="flex-1">
        <PageHeader
          title="Your Rewards 🎁"
          subtitle="Keep learning to unlock special rewards!"
          showProfileBadge={false}
          leftElement={
            <TouchableOpacity onPress={() => router.back()} className="mr-3">
              <Ionicons name="arrow-back" size={24} color="#1E293B" />
            </TouchableOpacity>
          }
        />

        {/* Progress Overview */}
        <View className="px-5 mb-6">
          <ProgressSection
            title="Daily Progress"
            current={rewardProgress.dailyProgress.points}
            total={100}
            color="#6366F1"
          />
          <ProgressSection
            title="Weekly Challenge"
            current={rewardProgress.weeklyProgress.points}
            total={1000}
            color="#EC4899"
          />
        </View>

        {/* Available Rewards */}
        {availableRewards.length > 0 && (
          <View className="px-5 mb-6">
            <Text className="text-xl font-bold text-[#1E293B] mb-4">
              Available Rewards ✨
            </Text>
            {availableRewards.map((reward) => (
              <RewardCard
                key={reward.id}
                reward={reward}
                progress={rewardProgress.rewards[reward.id]?.progress || 0}
                onPress={() => handleRewardPress(reward.id)}
              />
            ))}
          </View>
        )}

        {/* Special Rewards */}
        {specialRewards.length > 0 && (
          <View className="px-5 mb-6">
            <Text className="text-xl font-bold text-[#1E293B] mb-4">
              Special Rewards 🌟
            </Text>
            {specialRewards.map((reward) => (
              <RewardCard
                key={reward.id}
                reward={reward}
                isLocked
                onPress={() => handleRewardPress(reward.id)}
              />
            ))}
          </View>
        )}

        {/* Completed Rewards */}
        {completedRewards.length > 0 && (
          <View className="px-5 mb-6">
            <Text className="text-xl font-bold text-[#1E293B] mb-4">
              Completed 🎉
            </Text>
            {completedRewards.map((reward) => (
              <RewardCard
                key={reward.id}
                reward={reward}
                progress={100}
                onPress={() => handleRewardPress(reward.id)}
              />
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
