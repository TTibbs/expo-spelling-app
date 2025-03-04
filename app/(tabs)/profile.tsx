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
import {
  LearnedWord,
  UserProfile,
  PlayerLevel,
  ChildProfile,
} from "@/types/common";
import { MathStats } from "@/types/numbers";
import { getData, StorageKeys, storeData } from "@/lib/storage";
import { useChild } from "@/context/ChildContext";

export default function ProfileScreen(): JSX.Element {
  const router = useRouter();
  const { activeChild, setActiveChild, isLoading: isChildLoading } = useChild();
  const [learnedWords, setLearnedWords] = useState<LearnedWord[]>([]);
  const [userProfile, setUserProfile] = useState<UserProfile>({
    id: "default",
    name: "Default User",
    xp: 0,
    level: "1",
    lastPlayed: null,
    isParent: false,
    createdAt: new Date().toISOString(),
  });
  const [childProfiles, setChildProfiles] = useState<ChildProfile[]>([]);
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

  // Stats for the profile
  const totalWords = learnedWords.length;
  const categories = [...new Set(learnedWords.map((word) => word.category))]
    .length;

  // Get current level data
  const currentLevel: PlayerLevel =
    playerLevels.find(
      (level) =>
        level.id === (activeChild ? activeChild.level : userProfile.level)
    ) || playerLevels[0];
  const nextLevel: PlayerLevel | undefined = playerLevels.find(
    (level) =>
      level.id ===
      String(Number(activeChild ? activeChild.level : userProfile.level) + 1)
  );

  // Calculate XP progress
  const currentXP = activeChild ? activeChild.xp : userProfile.xp;
  const xpForCurrentLevel: number = currentXP - (currentLevel?.minXp || 0);
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

      // Load data based on whether we're viewing a child's profile or the parent's profile
      if (activeChild) {
        // Load child-specific learned words
        const childLearnedWords = await getData(
          StorageKeys.CHILD_LEARNED_WORDS
        );
        if (childLearnedWords && childLearnedWords[activeChild.id]) {
          setLearnedWords(childLearnedWords[activeChild.id]);
        } else {
          setLearnedWords([]);
        }

        // Load child-specific math stats
        const childMathStats = await getData(StorageKeys.CHILD_MATH_STATS);
        if (childMathStats && childMathStats[activeChild.id]) {
          setMathStats(childMathStats[activeChild.id]);
        } else {
          setMathStats({
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
        }

        // Update child's level based on XP
        const childProfiles = await getData(StorageKeys.CHILD_PROFILES);
        if (childProfiles) {
          const childIndex = childProfiles.findIndex(
            (child) => child.id === activeChild.id
          );
          if (childIndex !== -1) {
            const updatedChild = { ...childProfiles[childIndex] };
            let newLevel = "1";

            // Find the appropriate level based on XP
            for (const level of playerLevels) {
              if (
                updatedChild.xp >= level.minXp &&
                updatedChild.xp < level.maxXp
              ) {
                newLevel = level.id;
                break;
              }
            }

            // Handle case where XP exceeds the highest level
            if (
              updatedChild.xp >= playerLevels[playerLevels.length - 1].maxXp
            ) {
              newLevel = playerLevels[playerLevels.length - 1].id;
            }

            // Update level if it has changed
            if (updatedChild.level !== newLevel) {
              updatedChild.level = newLevel;
              childProfiles[childIndex] = updatedChild;
              await storeData(StorageKeys.CHILD_PROFILES, childProfiles);
            }
          }
        }
      } else {
        // Load parent's learned words
        const storedWords = await getData(StorageKeys.LEARNED_WORDS);
        if (storedWords) {
          setLearnedWords(storedWords);
        }

        // Load parent's math stats
        const mathStats = await getData(StorageKeys.MATH_STATS);
        if (mathStats) {
          setMathStats(mathStats);
        }

        // Update parent's level based on XP
        const userProfile = await getData(StorageKeys.USER_PROFILE);
        if (userProfile) {
          const updatedProfile = { ...userProfile };
          let newLevel = "1";

          // Find the appropriate level based on XP
          for (const level of playerLevels) {
            if (
              updatedProfile.xp >= level.minXp &&
              updatedProfile.xp < level.maxXp
            ) {
              newLevel = level.id;
              break;
            }
          }

          // Handle case where XP exceeds the highest level
          if (
            updatedProfile.xp >= playerLevels[playerLevels.length - 1].maxXp
          ) {
            newLevel = playerLevels[playerLevels.length - 1].id;
          }

          // Update level if it has changed
          if (updatedProfile.level !== newLevel) {
            updatedProfile.level = newLevel;
            await storeData(StorageKeys.USER_PROFILE, updatedProfile);
          }
        }
      }

      // Load user profile
      const userProfile = await getData(StorageKeys.USER_PROFILE);
      if (userProfile) {
        setUserProfile(userProfile);
      }

      // Load child profiles
      const childProfiles = await getData(StorageKeys.CHILD_PROFILES);
      if (childProfiles) {
        setChildProfiles(childProfiles);
      }

      setIsLoading(false);
    } catch (error) {
      console.error(
        "Error loading user data:",
        error instanceof Error ? error.message : "Unknown error"
      );
      setIsLoading(false);
    }
  }, [activeChild]);

  // Load data on initial mount and when active child changes
  useEffect(() => {
    loadUserData();
  }, [loadUserData]);

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

  const handleChildSelect = async (child: ChildProfile) => {
    try {
      setActiveChild(child);
      // Load the selected child's data immediately
      const childLearnedWords = await getData(StorageKeys.CHILD_LEARNED_WORDS);
      if (childLearnedWords && childLearnedWords[child.id]) {
        setLearnedWords(childLearnedWords[child.id]);
      } else {
        setLearnedWords([]);
      }

      const childMathStats = await getData(StorageKeys.CHILD_MATH_STATS);
      if (childMathStats && childMathStats[child.id]) {
        setMathStats(childMathStats[child.id]);
      } else {
        setMathStats({
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
      }
    } catch (error) {
      console.error("Error loading child data:", error);
    }
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
            {activeChild
              ? `${activeChild.name}'s Profile`
              : "My Learning Profile"}
          </Text>
          <TouchableOpacity
            onPress={() => router.push("/(protected)/settings")}
            className="flex-row items-center gap-2"
          >
            <Text className="text-sm text-[#6366F1]">Parental Controls</Text>
            <Ionicons name="settings-outline" color="#6366F1" size={20} />
          </TouchableOpacity>
        </View>

        {/* Child Profiles Section */}
        {userProfile.isParent && childProfiles.length > 0 && (
          <View className="px-5 mb-5">
            <Text className="text-lg font-bold text-[#1E293B] mb-3">
              Child Profiles
            </Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {childProfiles.map((child) => (
                <TouchableOpacity
                  key={child.id}
                  className={`bg-white rounded-xl p-4 mr-3 w-40 shadow-sm ${
                    activeChild?.id === child.id
                      ? "border-2 border-[#6366F1]"
                      : ""
                  }`}
                  onPress={() => handleChildSelect(child)}
                >
                  <View className="w-12 h-12 rounded-full bg-[#EEF2FF] justify-center items-center mb-2">
                    <Ionicons name="person" color="#6366F1" size={24} />
                  </View>
                  <Text className="font-bold text-[#1E293B] mb-1">
                    {child.name}
                  </Text>
                  <Text className="text-xs text-[#64748B]">
                    Level {child.level}
                  </Text>
                  <Text className="text-xs text-[#64748B]">{child.xp} XP</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        {/* Level progress bar */}
        <View className="mx-5 mb-5 bg-white p-4 rounded-xl shadow-sm">
          <View className="flex-row justify-between items-center mb-2">
            <Text className="text-base font-bold text-[#1E293B]">
              Level {activeChild ? activeChild.level : userProfile.level}:{" "}
              {currentLevel?.title || "Beginner"}
            </Text>
            <Text className="text-sm text-[#6366F1] font-bold">
              {activeChild ? activeChild.xp : userProfile.xp} XP Total
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
              Level {activeChild ? activeChild.level : userProfile.level}
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
