import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ListRenderItemInfo,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter, useFocusEffect } from "expo-router";
import { playerLevels } from "@/lib/data";
import { LearnedWord, UserProfile, PlayerLevel } from "@/types/common";
import { MathStats } from "@/types/numbers";
import { getData, StorageKeys } from "@/lib/storage";

export default function ProfileScreen(): JSX.Element {
  const [learnedWords, setLearnedWords] = useState<LearnedWord[]>([]);
  const [userProfile, setUserProfile] = useState<UserProfile>({
    xp: 0,
    level: "1",
    lastPlayed: null,
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<"spelling" | "math">("spelling");
  const [mathStats, setMathStats] = useState<MathStats>({
    totalProblems: 0,
    correctAnswers: 0,
    streak: 0,
    highestStreak: 0,
    addition: {
      attempted: 0,
      correct: 0,
      accuracy: 0,
      timeSpent: 0,
      averageTime: 0,
      highestScore: 0,
      perfectScores: 0,
      hintsUsed: 0,
      strategies: {},
    },
    subtraction: {
      attempted: 0,
      correct: 0,
      accuracy: 0,
      timeSpent: 0,
      averageTime: 0,
      highestScore: 0,
      perfectScores: 0,
      hintsUsed: 0,
      strategies: {},
    },
    counting: {
      attempted: 0,
      correct: 0,
      accuracy: 0,
      timeSpent: 0,
      averageTime: 0,
      highestScore: 0,
      perfectScores: 0,
      hintsUsed: 0,
      strategies: {},
    },
    multiplication: {
      attempted: 0,
      correct: 0,
      accuracy: 0,
      timeSpent: 0,
      averageTime: 0,
      highestScore: 0,
      perfectScores: 0,
      hintsUsed: 0,
      strategies: {},
    },
    division: {
      attempted: 0,
      correct: 0,
      accuracy: 0,
      timeSpent: 0,
      averageTime: 0,
      highestScore: 0,
      perfectScores: 0,
      hintsUsed: 0,
      strategies: {},
    },
    averageTimePerProblem: 0,
    lastPlayed: "",
    achievements: [],
  });
  const router = useRouter();

  // Stats for the profile
  const totalWords = learnedWords.length;
  const categories = [...new Set(learnedWords.map((word) => word.category))]
    .length;

  // Get current level data
  const currentLevel: PlayerLevel =
    playerLevels.find((level) => level.id === userProfile.level) ||
    playerLevels[0];
  const nextLevel: PlayerLevel | undefined = playerLevels.find(
    (level) => level.id === String(Number(userProfile.level) + 1)
  );

  // Calculate XP progress
  const xpForCurrentLevel: number = userProfile.xp - (currentLevel?.minXp || 0);
  const xpRequiredForNextLevel: number = nextLevel
    ? nextLevel.minXp - (currentLevel?.minXp || 0)
    : 100; // Default to 100 if at max level
  const progressPercentage: number = Math.min(
    (xpForCurrentLevel / Math.max(xpRequiredForNextLevel, 1)) * 100,
    100
  );

  const loadUserData = useCallback(async (): Promise<void> => {
    try {
      setIsLoading(true);

      // Load learned words using type-safe storage
      const storedWords = await getData(StorageKeys.LEARNED_WORDS);
      if (storedWords) {
        setLearnedWords(storedWords);
      }

      // Load user profile using type-safe storage
      const userProfile = await getData(StorageKeys.USER_PROFILE);
      if (userProfile) {
        setUserProfile(userProfile);
      }

      // Load math stats using type-safe storage
      const mathStats = await getData(StorageKeys.MATH_STATS);
      if (mathStats) {
        setMathStats(mathStats);
      }

      setIsLoading(false);
    } catch (error) {
      console.error(
        "Error loading user data:",
        error instanceof Error ? error.message : "Unknown error"
      );
      setIsLoading(false);
    }
  }, []);

  // Load data on initial mount
  useEffect(() => {
    loadUserData();
  }, []);

  // Refresh data when the screen comes into focus
  useFocusEffect(
    useCallback(() => {
      loadUserData();
    }, [loadUserData])
  );

  const handleWordPress = (word: LearnedWord): void => {
    router.push({
      pathname: "/word/[id]",
      params: { id: word.id, category: word.category },
    });
  };

  const renderWordItem = ({
    item,
  }: ListRenderItemInfo<LearnedWord>): JSX.Element => (
    <TouchableOpacity
      className="bg-white rounded-xl mb-3 overflow-hidden flex-row shadow-sm"
      onPress={() => handleWordPress(item)}
    >
      <Image source={{ uri: item.image }} className="w-20 h-20" />
      <View className="p-3 flex-1 justify-center">
        <Text className="text-base font-bold text-[#1E293B] mb-1">
          {item.word}
        </Text>
        <Text className="text-sm text-[#6366F1] mb-1 capitalize">
          {item.category}
        </Text>
        <Text className="text-xs text-[#94A3B8]">
          Learned: {new Date(item.learnedAt).toLocaleDateString()}
        </Text>
      </View>
    </TouchableOpacity>
  );

  const renderEmptyState = (): JSX.Element => (
    <View className="items-center justify-center py-10">
      <Ionicons name="book-outline" color="#CBD5E1" size={60} />
      <Text className="text-lg font-bold text-[#1E293B] mt-4 mb-2">
        No Words Learned Yet
      </Text>
      <Text className="text-sm text-[#64748B] text-center mb-5 px-5">
        Start playing to add words to your collection!
      </Text>
      <TouchableOpacity
        className="bg-[#6366F1] py-3 px-6 rounded-lg"
        onPress={() => router.push("/learning/words")}
      >
        <Text className="text-white font-bold text-base">Start Learning</Text>
      </TouchableOpacity>
    </View>
  );

  const renderMathEmptyState = (): JSX.Element => (
    <View className="items-center justify-center py-10">
      <Ionicons name="calculator-outline" color="#CBD5E1" size={60} />
      <Text className="text-lg font-bold text-[#1E293B] mt-4 mb-2">
        No Math Progress Yet
      </Text>
      <Text className="text-sm text-[#64748B] text-center mb-5 px-5">
        Start solving math problems to see your progress!
      </Text>
      <TouchableOpacity
        className="bg-[#10B981] py-3 px-6 rounded-lg"
        onPress={() => router.push("/learning/numbers")}
      >
        <Text className="text-white font-bold text-base">Start Math</Text>
      </TouchableOpacity>
    </View>
  );

  // Render Math Stats component
  const renderMathStats = (): JSX.Element => {
    const accuracy =
      mathStats.totalProblems > 0
        ? Math.round((mathStats.correctAnswers / mathStats.totalProblems) * 100)
        : 0;

    return (
      <View className="flex-1">
        {/* Math activity cards */}
        <View className="flex-row flex-wrap justify-between">
          <View className="bg-white rounded-xl p-4 w-[48%] mb-4 shadow-sm">
            <View className="flex-row items-center mb-2">
              <View className="w-10 h-10 rounded-full bg-[#ECFDF5] justify-center items-center mr-2">
                <Ionicons name="add-circle-outline" color="#10B981" size={20} />
              </View>
              <Text className="font-bold text-[#1E293B]">Addition</Text>
            </View>
            <View className="flex-row justify-between items-center">
              <Text className="text-xs text-[#64748B]">Problems</Text>
              <Text className="text-sm font-bold text-[#10B981]">
                {mathStats.addition.attempted}
              </Text>
            </View>
            <View className="flex-row justify-between items-center mt-1">
              <Text className="text-xs text-[#64748B]">Accuracy</Text>
              <Text className="text-sm font-bold text-[#10B981]">
                {mathStats.addition.accuracy}%
              </Text>
            </View>
          </View>

          <View className="bg-white rounded-xl p-4 w-[48%] mb-4 shadow-sm">
            <View className="flex-row items-center mb-2">
              <View className="w-10 h-10 rounded-full bg-[#FEF3C7] justify-center items-center mr-2">
                <Ionicons
                  name="remove-circle-outline"
                  color="#F59E0B"
                  size={20}
                />
              </View>
              <Text className="font-bold text-[#1E293B]">Subtraction</Text>
            </View>
            <View className="flex-row justify-between items-center">
              <Text className="text-xs text-[#64748B]">Problems</Text>
              <Text className="text-sm font-bold text-[#F59E0B]">
                {mathStats.subtraction.attempted}
              </Text>
            </View>
            <View className="flex-row justify-between items-center mt-1">
              <Text className="text-xs text-[#64748B]">Accuracy</Text>
              <Text className="text-sm font-bold text-[#F59E0B]">
                {mathStats.subtraction.accuracy}%
              </Text>
            </View>
          </View>

          <View className="bg-white rounded-xl p-4 w-[48%] mb-4 shadow-sm">
            <View className="flex-row items-center mb-2">
              <View className="w-10 h-10 rounded-full bg-[#EDE9FE] justify-center items-center mr-2">
                <Ionicons name="list-outline" color="#8B5CF6" size={20} />
              </View>
              <Text className="font-bold text-[#1E293B]">Counting</Text>
            </View>
            <View className="flex-row justify-between items-center">
              <Text className="text-xs text-[#64748B]">Problems</Text>
              <Text className="text-sm font-bold text-[#8B5CF6]">
                {mathStats.counting.attempted}
              </Text>
            </View>
            <View className="flex-row justify-between items-center mt-1">
              <Text className="text-xs text-[#64748B]">Accuracy</Text>
              <Text className="text-sm font-bold text-[#8B5CF6]">
                {mathStats.counting.accuracy}%
              </Text>
            </View>
          </View>

          <View className="bg-white rounded-xl p-4 w-[48%] mb-4 shadow-sm">
            <View className="flex-row items-center mb-2">
              <View className="w-10 h-10 rounded-full bg-[#EEF2FF] justify-center items-center mr-2">
                <Ionicons
                  name="stats-chart-outline"
                  color="#6366F1"
                  size={20}
                />
              </View>
              <Text className="font-bold text-[#1E293B]">Overall</Text>
            </View>
            <View className="flex-row justify-between items-center">
              <Text className="text-xs text-[#64748B]">Problems</Text>
              <Text className="text-sm font-bold text-[#6366F1]">
                {mathStats.totalProblems}
              </Text>
            </View>
            <View className="flex-row justify-between items-center mt-1">
              <Text className="text-xs text-[#64748B]">Accuracy</Text>
              <Text className="text-sm font-bold text-[#6366F1]">
                {accuracy}%
              </Text>
            </View>
          </View>
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
              {mathStats.highestStreak}
            </Text>
          </View>
          <Text className="text-xs text-[#64748B] mt-1">
            Your best sequence of correct answers in a row!
          </Text>
        </View>

        {/* Start math button */}
        <TouchableOpacity
          className="bg-[#10B981] py-4 rounded-xl items-center"
          onPress={() => router.push("/learning/numbers")}
        >
          <Text className="text-white font-bold text-base">
            Continue Math Adventure
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-[#F9F9F9]">
      <ScrollView>
        <View className="px-5 pt-5 pb-4 flex-row justify-between items-center">
          <Text className="text-2xl font-bold text-[#1E293B]">
            My Learning Profile
          </Text>
          <TouchableOpacity
            onPress={() => router.push("/(protected)/settings")}
            className="flex-row items-center gap-2"
          >
            <Text className="text-sm text-[#6366F1]">Parental Controls</Text>
            <Ionicons name="settings-outline" color="#6366F1" size={20} />
          </TouchableOpacity>
        </View>

        {/* Level progress bar */}
        <View className="mx-5 mb-5 bg-white p-4 rounded-xl shadow-sm">
          <View className="flex-row justify-between items-center mb-2">
            <Text className="text-base font-bold text-[#1E293B]">
              Level {userProfile.level}: {currentLevel?.title || "Beginner"}
            </Text>
            <Text className="text-sm text-[#6366F1] font-bold">
              {userProfile.xp} XP Total
            </Text>
          </View>

          <View className="h-3 bg-[#EEF2FF] rounded-full overflow-hidden mb-2">
            <View
              className="h-full bg-[#6366F1]"
              style={{ width: `${Math.min(progressPercentage, 100)}%` }}
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

        {/* Stats summary cards */}
        <View className="flex-row justify-between px-5 mb-5">
          <View className="bg-white rounded-xl p-4 items-center w-[30%] shadow-sm">
            <View className="w-10 h-10 rounded-full bg-[#EEF2FF] justify-center items-center mb-2">
              <Ionicons name="book-outline" color="#6366F1" size={20} />
            </View>
            <Text className="text-lg font-bold text-[#1E293B] mb-1">
              {totalWords}
            </Text>
            <Text className="text-xs text-[#64748B] text-center">
              Words Learned
            </Text>
          </View>

          <View className="bg-white rounded-xl p-4 items-center w-[30%] shadow-sm">
            <View className="w-10 h-10 rounded-full bg-[#ECFDF5] justify-center items-center mb-2">
              <Ionicons name="calculator-outline" color="#10B981" size={20} />
            </View>
            <Text className="text-lg font-bold text-[#1E293B] mb-1">
              {mathStats.totalProblems}
            </Text>
            <Text className="text-xs text-[#64748B] text-center">
              Math Problems
            </Text>
          </View>

          <View className="bg-white rounded-xl p-4 items-center w-[30%] shadow-sm">
            <View className="w-10 h-10 rounded-full bg-[#EEF2FF] justify-center items-center mb-2">
              <Ionicons name="star-outline" color="#6366F1" size={20} />
            </View>
            <Text className="text-lg font-bold text-[#1E293B] mb-1">
              Level {userProfile.level}
            </Text>
            <Text className="text-xs text-[#64748B] text-center">
              {currentLevel.title}
            </Text>
          </View>
        </View>

        {/* Learning path tabs */}
        <View className="flex-row px-5 mb-4">
          <TouchableOpacity
            className={`flex-1 py-3 ${
              activeTab === "spelling"
                ? "border-b-2 border-[#6366F1]"
                : "border-b-2 border-[#E2E8F0]"
            }`}
            onPress={() => setActiveTab("spelling")}
          >
            <Text
              className={`text-center font-bold ${
                activeTab === "spelling" ? "text-[#6366F1]" : "text-[#64748B]"
              }`}
            >
              Spelling & Words
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            className={`flex-1 py-3 ${
              activeTab === "math"
                ? "border-b-2 border-[#10B981]"
                : "border-b-2 border-[#E2E8F0]"
            }`}
            onPress={() => setActiveTab("math")}
          >
            <Text
              className={`text-center font-bold ${
                activeTab === "math" ? "text-[#10B981]" : "text-[#64748B]"
              }`}
            >
              Numbers & Math
            </Text>
          </TouchableOpacity>
        </View>

        {/* Learning path content */}
        <View className="px-5 pb-10">
          {activeTab === "spelling" ? (
            <>
              <View className="flex-row items-center justify-between mb-4">
                <Text className="text-lg font-bold text-[#1E293B]">
                  Words I've Learned
                </Text>
                <Ionicons name="trophy-outline" color="#6366F1" size={20} />
              </View>

              {isLoading ? (
                <View className="justify-center items-center py-10">
                  <Text>Loading...</Text>
                </View>
              ) : learnedWords.length > 0 ? (
                learnedWords.map((word) => (
                  <TouchableOpacity
                    key={`${word.id}-${word.learnedAt}`}
                    className="bg-white rounded-xl mb-3 overflow-hidden flex-row shadow-sm"
                    onPress={() => handleWordPress(word)}
                  >
                    <Image source={{ uri: word.image }} className="w-20 h-20" />
                    <View className="p-3 flex-1 justify-center">
                      <Text className="text-base font-bold text-[#1E293B] mb-1">
                        {word.word}
                      </Text>
                      <Text className="text-sm text-[#6366F1] mb-1 capitalize">
                        {word.category}
                      </Text>
                      <Text className="text-xs text-[#94A3B8]">
                        Learned: {new Date(word.learnedAt).toLocaleDateString()}
                      </Text>
                    </View>
                  </TouchableOpacity>
                ))
              ) : (
                renderEmptyState()
              )}
            </>
          ) : (
            <>
              <View className="flex-row items-center justify-between mb-4">
                <Text className="text-lg font-bold text-[#1E293B]">
                  My Math Progress
                </Text>
                <Ionicons name="calculator-outline" color="#10B981" size={20} />
              </View>

              {isLoading ? (
                <View className="justify-center items-center py-10">
                  <Text>Loading...</Text>
                </View>
              ) : mathStats.totalProblems > 0 ? (
                renderMathStats()
              ) : (
                renderMathEmptyState()
              )}
            </>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
