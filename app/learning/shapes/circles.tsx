import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  Animated,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import { shapes } from "@/lib/data";
import { Circle, CircleType } from "@/types/shapes";
import {
  updateShapeCategoryStats,
  loadShapeStats,
  ShapeStorageError,
} from "@/lib/shapeUtils";
import { getData, storeData, StorageKeys } from "@/lib/storage";
import { useChild } from "@/context/ChildContext";
import { getShapeStats, saveShapeStats, updateUserXP } from "@/lib/storage";
import { ShapeStats } from "@/types/shapes";

// Filter circles from shapes array
const circles = shapes.filter(
  (shape): shape is Circle => shape.type === "circle" || shape.type === "oval"
);

// Utility functions
const calculateAccuracy = (completed: number, attempts: number): number => {
  if (attempts === 0) return 0;
  return Math.round((completed / attempts) * 100);
};

const calculateXP = (completed: number): number => {
  // Base XP for completing a shape
  let xp = 10;

  // Bonus XP for perfect accuracy
  if (completed % 5 === 0) {
    xp += 5;
  }

  return xp;
};

export default function CirclesScreen(): JSX.Element {
  const router = useRouter();
  const { activeChild } = useChild();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [completed, setCompleted] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [answerAnimation] = useState(new Animated.Value(0));
  const [shapeStats, setShapeStats] = useState<ShapeStats>({
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

  useEffect(() => {
    // Load progress using the updated loadShapeStats function
    const loadProgress = async (): Promise<void> => {
      try {
        const shapeStats = await loadShapeStats();
        setCompleted(shapeStats.circles.completed);
      } catch (error) {
        const errorMessage =
          error instanceof ShapeStorageError
            ? error.message
            : error instanceof Error
            ? error.message
            : "Unknown error";

        console.error("Error loading shape progress:", errorMessage);
      }
    };

    loadProgress();
  }, []);

  // Load shape stats
  useEffect(() => {
    const loadStats = async () => {
      try {
        const stats = await getShapeStats(activeChild?.id);
        setShapeStats(stats);
      } catch (error) {
        console.error("Error loading shape stats:", error);
      }
    };

    loadStats();
  }, [activeChild?.id]);

  const saveProgress = async (): Promise<void> => {
    try {
      // Update user profile XP using type-safe storage
      const userProfile = await getData(StorageKeys.USER_PROFILE);
      if (userProfile) {
        const updatedXp = (userProfile.xp || 0) + 5;
        const updatedProfile = {
          ...userProfile,
          xp: updatedXp,
        };
        await storeData(StorageKeys.USER_PROFILE, updatedProfile);
      }

      // Update shape statistics using our utility function
      const shapeStats = await updateShapeCategoryStats("circles");
      setCompleted(shapeStats.circles.completed);
    } catch (error) {
      const errorMessage =
        error instanceof ShapeStorageError
          ? error.message
          : error instanceof Error
          ? error.message
          : "Unknown error";

      console.error("Error saving progress:", errorMessage);
      Alert.alert(
        "Error",
        "There was a problem saving your progress. Please try again."
      );
    }
  };

  // Save shape stats
  const saveStats = async (newStats: ShapeStats) => {
    try {
      const success = await saveShapeStats(newStats, activeChild?.id);
      if (success) {
        setShapeStats(newStats);
      }
    } catch (error) {
      console.error("Error saving shape stats:", error);
    }
  };

  const handleNext = (): void => {
    if (currentIndex < circles.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setShowAnswer(false);
      answerAnimation.setValue(0);
    } else {
      // Completed all shapes
      Alert.alert(
        "Well Done!",
        "You've completed the Circles & Ovals lesson!",
        [{ text: "OK", onPress: () => router.back() }]
      );
    }
  };

  const handleShowProperties = async (): Promise<void> => {
    setShowAnswer(true);
    setScore(score + 5);

    const newStats: ShapeStats = {
      ...shapeStats,
      circles: {
        ...shapeStats.circles,
        completed: shapeStats.circles.completed + 1,
        correct: shapeStats.circles.correct + 1,
        attempts: shapeStats.circles.attempts + 1,
        accuracy: calculateAccuracy(
          shapeStats.circles.completed + 1,
          shapeStats.circles.attempts + 1
        ),
      },
    };

    await saveStats(newStats);

    Animated.timing(answerAnimation, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  };

  // Get the current shape
  const currentShape = circles[currentIndex];

  // Get color based on circle type
  const getTypeColor = (type: CircleType): string => {
    switch (type) {
      case "circle":
        return "bg-emerald-500";
      case "oval":
        return "bg-blue-500";
      default:
        return "bg-pink-500";
    }
  };

  const getTypeText = (type: CircleType): string => {
    switch (type) {
      case "circle":
        return "Circle";
      case "oval":
        return "Oval";
      default:
        return "Unknown";
    }
  };

  // Handle correct answer
  const handleCorrectAnswer = async () => {
    const newStats: ShapeStats = {
      ...shapeStats,
      totalShapes: shapeStats.totalShapes + 1,
      circles: {
        ...shapeStats.circles,
        completed: shapeStats.circles.completed + 1,
        correct: shapeStats.circles.correct + 1,
        attempts: shapeStats.circles.attempts + 1,
        accuracy: calculateAccuracy(
          shapeStats.circles.completed + 1,
          shapeStats.circles.attempts + 1
        ),
      },
    };

    await saveStats(newStats);

    // Award XP
    const xpEarned = calculateXP(shapeStats.circles.completed + 1);
    await updateUserXP(xpEarned, activeChild?.id);

    // ... rest of the existing handleCorrectAnswer code ...
  };

  // Handle incorrect answer
  const handleIncorrectAnswer = async () => {
    const newStats: ShapeStats = {
      ...shapeStats,
      circles: {
        ...shapeStats.circles,
        attempts: shapeStats.circles.attempts + 1,
        accuracy: calculateAccuracy(
          shapeStats.circles.completed,
          shapeStats.circles.attempts + 1
        ),
      },
    };

    await saveStats(newStats);
    // ... rest of the existing handleIncorrectAnswer code ...
  };

  return (
    <SafeAreaView className="flex-1 bg-amber-50">
      <ScrollView className="flex-1 p-4">
        {/* Progress indicator */}
        <View className="mb-4">
          <Text className="text-sm text-slate-500 mb-1">
            Shape {currentIndex + 1} of {circles.length}
          </Text>
          <View className="h-2 bg-slate-200 rounded-full overflow-hidden">
            <View
              className="h-full bg-amber-500 rounded-full"
              style={{
                width: `${((currentIndex + 1) / circles.length) * 100}%`,
              }}
            />
          </View>
        </View>

        {/* Shape image */}
        <View className="h-48 rounded-2xl overflow-hidden mb-4">
          <Image
            source={{ uri: currentShape.image }}
            className="w-full h-full"
            resizeMode="cover"
          />
          <View className="absolute bottom-0 left-0 right-0 bg-black/60 p-3 flex-row justify-between items-center">
            <Text className="text-lg font-bold text-white">
              {currentShape.name}
            </Text>
            <View
              className={`px-2 py-1 rounded-full ${getTypeColor(
                currentShape.type
              )}`}
            >
              <Text className="text-xs font-bold text-white">
                {getTypeText(currentShape.type)}
              </Text>
            </View>
          </View>
        </View>

        {/* Shape description */}
        <View className="bg-white p-4 rounded-xl mb-4">
          <Text className="text-base font-bold text-slate-800 mb-2">
            Description
          </Text>
          <Text className="text-sm text-slate-500 leading-5">
            {currentShape.description}
          </Text>
        </View>

        {/* Properties section */}
        <View className="bg-white p-4 rounded-xl mb-4">
          <Text className="text-base font-bold text-slate-800 mb-3">
            Properties
          </Text>

          {showAnswer ? (
            <Animated.View
              className="space-y-2"
              style={{
                opacity: answerAnimation,
                transform: [
                  {
                    translateY: answerAnimation.interpolate({
                      inputRange: [0, 1],
                      outputRange: [20, 0],
                    }),
                  },
                ],
              }}
            >
              {currentShape.properties.map(
                (property: string, index: number) => (
                  <View key={index} className="flex-row items-center">
                    <Ionicons
                      name="checkmark-circle"
                      size={20}
                      color={getTypeColor(currentShape.type)}
                    />
                    <Text className="text-sm text-slate-500 ml-2 flex-1">
                      {property}
                    </Text>
                  </View>
                )
              )}
            </Animated.View>
          ) : (
            <TouchableOpacity
              className="bg-amber-500 py-3 rounded-lg items-center"
              onPress={handleShowProperties}
            >
              <Text className="text-white text-base font-bold">
                Reveal Properties
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Navigation buttons */}
        <View className="flex-row mb-4">
          <TouchableOpacity
            className={`flex-1 flex-row justify-center items-center py-3 rounded-lg ${getTypeColor(
              currentShape.type
            )}`}
            onPress={handleNext}
          >
            <Text className="text-white text-base font-bold mr-2">
              {currentIndex < circles.length - 1 ? "Next Shape" : "Finish"}
            </Text>
            <Ionicons
              name={
                currentIndex < circles.length - 1
                  ? "arrow-forward"
                  : "checkmark-done"
              }
              size={20}
              color="white"
            />
          </TouchableOpacity>
        </View>

        {/* Score display */}
        <View className="flex-row items-center justify-end mb-4">
          <Text className="text-base text-slate-500 mr-1">Score:</Text>
          <Text className="text-lg font-bold text-emerald-500">{score} XP</Text>
        </View>

        {/* Stats */}
        <View className="bg-slate-100 p-3 rounded-lg">
          <View className="flex-row items-center">
            <Ionicons name="eye-outline" size={20} color="#64748B" />
            <Text className="text-sm text-slate-500 ml-2">
              {completed} shapes completed in total
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
