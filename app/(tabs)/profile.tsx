import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
  Alert,
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
  RewardProgress,
} from "@/types/common";
import { MathStats as MathStatsType } from "@/types/numbers";
import { ShapeStats as ShapeStatsType } from "@/types/shapes";
import {
  getData,
  StorageKeys,
  storeData,
  getRewardProgress,
} from "@/lib/storage";
import { useChild } from "@/context/ChildContext";
import { PageHeader } from "@/components/PageHeader";
import { ChildProfileCard } from "@/components/ChildProfileCard";
import { LevelProgressBar } from "@/components/LevelProgressBar";
import { StatsCard } from "@/components/StatsCard";
import { WordCard } from "@/components/WordCard";
import { EmptyState } from "@/components/EmptyState";
import { MathStats } from "@/components/MathStats";
import { initializeRewardProgress } from "@/lib/utils";
import Tooltip from "react-native-walkthrough-tooltip";

export default function ProfileScreen(): JSX.Element {
  const router = useRouter();
  const { activeChild, setActiveChild } = useChild();
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
  const [activeTab, setActiveTab] = useState<"spelling" | "math" | "shapes">(
    "spelling"
  );
  const [mathStats, setMathStats] = useState<MathStatsType>({
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
  const [shapeStats, setShapeStats] = useState<ShapeStatsType>({
    totalShapes: 0,
    circles: {
      completed: 0,
      accuracy: 0,
      correct: 0,
      attempts: 0,
      timeSpent: 0,
      averageTime: 0,
      highestScore: 0,
      perfectScores: 0,
      hintsUsed: 0,
      propertiesLearned: [],
    },
    squares: {
      completed: 0,
      accuracy: 0,
      correct: 0,
      attempts: 0,
      timeSpent: 0,
      averageTime: 0,
      highestScore: 0,
      perfectScores: 0,
      hintsUsed: 0,
      propertiesLearned: [],
    },
    triangles: {
      completed: 0,
      accuracy: 0,
      correct: 0,
      attempts: 0,
      timeSpent: 0,
      averageTime: 0,
      highestScore: 0,
      perfectScores: 0,
      hintsUsed: 0,
      propertiesLearned: [],
    },
    polygons: {
      completed: 0,
      accuracy: 0,
      correct: 0,
      attempts: 0,
      timeSpent: 0,
      averageTime: 0,
      highestScore: 0,
      perfectScores: 0,
      hintsUsed: 0,
      propertiesLearned: [],
    },
    averageTimePerShape: 0,
    lastPlayed: new Date().toISOString(),
    achievements: [],
  });
  const [refreshing, setRefreshing] = React.useState(false);
  const [rewardProgress, setRewardProgress] = useState<RewardProgress>(() =>
    initializeRewardProgress(activeChild?.id || "default")
  );
  const [showTutorial, setShowTutorial] = useState<boolean>(true);
  const [currentStep, setCurrentStep] = useState<number>(0);

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

  const loadUserData = useCallback(async (): Promise<void> => {
    try {
      setIsLoading(true);

      // Load reward progress
      if (activeChild) {
        const childRewardProgress = await getData(
          StorageKeys.CHILD_REWARD_PROGRESS
        );
        if (childRewardProgress && childRewardProgress[activeChild.id]) {
          setRewardProgress(childRewardProgress[activeChild.id]);
        }
      } else {
        const userRewardProgress = await getData(StorageKeys.REWARD_PROGRESS);
        if (userRewardProgress) {
          setRewardProgress(userRewardProgress);
        }
      }

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

        // Load shape stats
        const childShapeStats = await getData(StorageKeys.CHILD_SHAPE_STATS);
        if (childShapeStats && childShapeStats[activeChild.id]) {
          setShapeStats(childShapeStats[activeChild.id]);
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

        // Load shape stats
        const shapeStats = await getData(StorageKeys.SHAPE_STATS);
        if (shapeStats) {
          setShapeStats(shapeStats);
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

  const onRefresh = React.useCallback(async () => {
    try {
      setRefreshing(true);
      await loadUserData();
    } catch (error) {
      console.error("Error refreshing profile data:", error);
      Alert.alert("Error", "Failed to refresh profile data. Please try again.");
    } finally {
      // Ensure we wait at least 1 second for the refresh indicator
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setRefreshing(false);
    }
  }, [loadUserData]);

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

  // Load reward progress
  const loadRewardProgress = useCallback(async () => {
    try {
      const progress = await getRewardProgress(activeChild?.id);
      if (progress) {
        setRewardProgress(progress);
      } else {
        setRewardProgress(
          initializeRewardProgress(activeChild?.id || "default")
        );
      }
    } catch (error) {
      console.error("Error loading reward progress:", error);
    }
  }, [activeChild?.id]);

  // Use focus effect to reload reward progress when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      loadRewardProgress();
    }, [loadRewardProgress])
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

  useEffect(() => {
    checkFirstTimeUser();
  }, []);

  const checkFirstTimeUser = async () => {
    try {
      const hasSeenTutorial = await getData(StorageKeys.HAS_SEEN_TUTORIAL);
      if (!hasSeenTutorial) {
        setShowTutorial(true);
        await storeData(StorageKeys.HAS_SEEN_TUTORIAL, true);
      }
    } catch (error) {
      console.error("Error checking tutorial status:", error);
    }
  };

  const handleSkipTutorial = () => {
    setShowTutorial(false);
  };

  const handleNextStep = () => {
    setCurrentStep((prevStep) => prevStep + 1);
  };

  return (
    <SafeAreaView className="flex-1 bg-[#F9F9F9]">
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <PageHeader
          title={
            activeChild
              ? `${activeChild.name}'s Profile`
              : "My Learning Profile"
          }
          rightElement={
            <TouchableOpacity
              onPress={() => router.push("/(protected)/settings" as const)}
              className="flex-row items-center gap-2"
            >
              <Text className="text-sm text-[#6366F1]">Parental Controls</Text>
              <Ionicons name="settings-outline" color="#6366F1" size={20} />
            </TouchableOpacity>
          }
        />

        {/* Child Profiles Section */}
        {userProfile.isParent && childProfiles.length > 0 && (
          <View className="px-5 mb-5">
            <Text className="text-lg font-bold text-[#1E293B] mb-3">
              Child Profiles
            </Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {childProfiles.map((child) => (
                <ChildProfileCard
                  key={child.id}
                  child={child}
                  isActive={activeChild?.id === child.id}
                  onPress={handleChildSelect}
                />
              ))}
            </ScrollView>
          </View>
        )}

        {showTutorial ? (
          <>
            <Tooltip
              isVisible={currentStep === 0}
              content={
                <View className="p-4">
                  <Text className="text-zinc-900 text-base font-bold mb-2">
                    Track Your Progress! 📊
                  </Text>
                  <Text className="text-zinc-900 text-sm mb-4">
                    See your level progress, XP, and achievements. Keep learning
                    to level up!
                  </Text>
                  <View className="flex-row justify-between">
                    <TouchableOpacity
                      onPress={handleSkipTutorial}
                      className="px-4 py-2"
                    >
                      <Text className="text-zinc-900 text-sm">Skip</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={handleNextStep}
                      className="bg-white px-4 py-2 rounded-lg"
                    >
                      <Text className="text-[#6366F1] font-bold">Next</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              }
              placement="bottom"
              onClose={() => setShowTutorial(false)}
              backgroundColor="rgba(0,0,0,0.7)"
            >
              <LevelProgressBar
                currentLevel={currentLevel}
                nextLevel={nextLevel}
                currentXP={currentXP}
              />
            </Tooltip>

            <Tooltip
              isVisible={currentStep === 1}
              content={
                <View className="p-4">
                  <Text className="text-zinc-900 text-base font-bold mb-2">
                    View Your Stats! 📈
                  </Text>
                  <Text className="text-zinc-900 text-sm mb-4">
                    Check your progress in words learned, math problems solved,
                    and daily points earned!
                  </Text>
                  <View className="flex-row justify-between">
                    <TouchableOpacity
                      onPress={handleSkipTutorial}
                      className="px-4 py-2"
                    >
                      <Text className="text-zinc-900 text-sm">Skip</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={handleNextStep}
                      className="bg-white px-4 py-2 rounded-lg"
                    >
                      <Text className="text-[#6366F1] font-bold">Next</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              }
              placement="bottom"
              onClose={() => setShowTutorial(false)}
              backgroundColor="rgba(0,0,0,0.7)"
            >
              <View className="flex-row justify-between px-5 mb-5">
                <StatsCard
                  icon="book-outline"
                  iconColor="#EEF2FF"
                  value={totalWords}
                  label="Words Learned"
                />
                <StatsCard
                  icon="calculator-outline"
                  iconColor="#ECFDF5"
                  value={mathStats.totalProblems}
                  label="Math Problems"
                />
                <StatsCard
                  icon="gift-outline"
                  iconColor="#FDF2F8"
                  value={rewardProgress.dailyProgress.points}
                  label="Daily Points"
                />
              </View>
            </Tooltip>

            <Tooltip
              isVisible={currentStep === 2}
              content={
                <View className="p-4">
                  <Text className="text-zinc-900 text-base font-bold mb-2">
                    Explore Your Learning Journey! 🎯
                  </Text>
                  <Text className="text-zinc-900 text-sm mb-4">
                    Switch between tabs to see your progress in spelling, math,
                    and shapes. Each area has its own achievements!
                  </Text>
                  <View className="flex-row justify-between">
                    <TouchableOpacity
                      onPress={handleSkipTutorial}
                      className="px-4 py-2"
                    >
                      <Text className="text-zinc-900 text-sm">Skip</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={handleNextStep}
                      className="bg-white px-4 py-2 rounded-lg"
                    >
                      <Text className="text-[#6366F1] font-bold">Finish</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              }
              placement="bottom"
              onClose={() => setShowTutorial(false)}
              backgroundColor="rgba(0,0,0,0.7)"
            >
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
                      activeTab === "spelling"
                        ? "text-[#6366F1]"
                        : "text-[#64748B]"
                    }`}
                  >
                    Spelling
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
                    Numbers
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  className={`flex-1 py-3 ${
                    activeTab === "shapes"
                      ? "border-b-2 border-[#3B82F6]"
                      : "border-b-2 border-[#E2E8F0]"
                  }`}
                  onPress={() => setActiveTab("shapes")}
                >
                  <Text
                    className={`text-center font-bold ${
                      activeTab === "shapes"
                        ? "text-[#3B82F6]"
                        : "text-[#64748B]"
                    }`}
                  >
                    Shapes
                  </Text>
                </TouchableOpacity>
              </View>
            </Tooltip>
          </>
        ) : (
          <>
            <LevelProgressBar
              currentLevel={currentLevel}
              nextLevel={nextLevel}
              currentXP={currentXP}
            />

            <View className="flex-row justify-between px-5 mb-5">
              <StatsCard
                icon="book-outline"
                iconColor="#EEF2FF"
                value={totalWords}
                label="Words Learned"
              />
              <StatsCard
                icon="calculator-outline"
                iconColor="#ECFDF5"
                value={mathStats.totalProblems}
                label="Math Problems"
              />
              <StatsCard
                icon="gift-outline"
                iconColor="#FDF2F8"
                value={rewardProgress.dailyProgress.points}
                label="Daily Points"
              />
            </View>

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
                    activeTab === "spelling"
                      ? "text-[#6366F1]"
                      : "text-[#64748B]"
                  }`}
                >
                  Spelling
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
                  Numbers
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                className={`flex-1 py-3 ${
                  activeTab === "shapes"
                    ? "border-b-2 border-[#3B82F6]"
                    : "border-b-2 border-[#E2E8F0]"
                }`}
                onPress={() => setActiveTab("shapes")}
              >
                <Text
                  className={`text-center font-bold ${
                    activeTab === "shapes" ? "text-[#3B82F6]" : "text-[#64748B]"
                  }`}
                >
                  Shapes
                </Text>
              </TouchableOpacity>
            </View>
          </>
        )}

        {/* Rewards quick access */}
        <TouchableOpacity
          className="mx-5 mb-5 bg-[#6366F1] p-4 rounded-xl flex-row items-center justify-between"
          onPress={() => router.push("/rewards")}
        >
          <View className="flex-row items-center">
            <Ionicons name="gift" size={24} color="white" />
            <Text className="text-white font-bold text-lg ml-3">
              View Rewards
            </Text>
          </View>
          <View className="flex-row items-center">
            <Text className="text-white mr-2">Check Progress</Text>
            <Ionicons name="chevron-forward" size={20} color="white" />
          </View>
        </TouchableOpacity>

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
                  <WordCard
                    key={`${word.id}-${word.learnedAt}`}
                    word={word}
                    onPress={handleWordPress}
                  />
                ))
              ) : (
                <EmptyState type="spelling" />
              )}
            </>
          ) : activeTab === "math" ? (
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
                <MathStats stats={mathStats} />
              ) : (
                <EmptyState type="math" />
              )}
            </>
          ) : (
            <>
              <View className="flex-row items-center justify-between mb-4">
                <Text className="text-lg font-bold text-[#1E293B]">
                  My Shapes Progress
                </Text>
                <Ionicons name="shapes-outline" color="#3B82F6" size={20} />
              </View>

              {isLoading ? (
                <View className="justify-center items-center py-10">
                  <Text>Loading...</Text>
                </View>
              ) : shapeStats.totalShapes > 0 ? (
                <View className="space-y-4">
                  <View className="flex-row justify-between">
                    <StatsCard
                      icon="ellipse-outline"
                      iconColor="#6366F1"
                      value={shapeStats.circles.completed}
                      label="Circles"
                    />
                    <StatsCard
                      icon="square-outline"
                      iconColor="#3B82F6"
                      value={shapeStats.squares.completed}
                      label="Squares"
                    />
                    <StatsCard
                      icon="triangle-outline"
                      iconColor="#10B981"
                      value={shapeStats.triangles.completed}
                      label="Triangles"
                    />
                  </View>

                  <View className="mt-6 bg-white rounded-xl p-4 shadow-sm">
                    <Text className="text-base font-bold text-slate-800 mb-2">
                      Overall Progress
                    </Text>
                    <View className="space-y-2">
                      <View className="flex-row justify-between">
                        <Text className="text-sm text-slate-600">
                          Shapes Completed
                        </Text>
                        <Text className="text-sm font-semibold text-slate-800">
                          {shapeStats.circles.completed +
                            shapeStats.squares.completed +
                            shapeStats.triangles.completed +
                            shapeStats.polygons.completed}
                        </Text>
                      </View>
                      <View className="flex-row justify-between">
                        <Text className="text-sm text-slate-600">Accuracy</Text>
                        <Text className="text-sm font-semibold text-slate-800">
                          {Math.round(
                            (shapeStats.circles.accuracy +
                              shapeStats.squares.accuracy +
                              shapeStats.triangles.accuracy +
                              shapeStats.polygons.accuracy) /
                              4
                          )}
                          %
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>
              ) : (
                <EmptyState type="shapes" />
              )}
            </>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
