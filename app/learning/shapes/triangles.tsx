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
import { triangles } from "@/lib/data";
import { TriangleType } from "@/types/shapes";
import { updateShapeCategoryStats, ShapeStorageError } from "@/lib/shapeUtils";
import { getData, storeData, StorageKeys } from "@/lib/storage";
import { useChild } from "@/context/ChildContext";
import { getShapeStats, saveShapeStats, updateUserXP } from "@/lib/storage";
import { ShapeStats } from "@/types/shapes";

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

export default function TrianglesScreen(): JSX.Element {
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

  // Handle correct answer
  const handleCorrectAnswer = async () => {
    const newStats: ShapeStats = {
      ...shapeStats,
      totalShapes: shapeStats.totalShapes + 1,
      triangles: {
        ...shapeStats.triangles,
        completed: shapeStats.triangles.completed + 1,
        correct: shapeStats.triangles.correct + 1,
        attempts: shapeStats.triangles.attempts + 1,
        accuracy: calculateAccuracy(
          shapeStats.triangles.completed + 1,
          shapeStats.triangles.attempts + 1
        ),
      },
    };

    await saveStats(newStats);

    // Award XP
    const xpEarned = calculateXP(shapeStats.triangles.completed + 1);
    await updateUserXP(xpEarned, activeChild?.id);

    setShowAnswer(true);
    setScore(score + 5);
    setCompleted(completed + 1);

    Animated.timing(answerAnimation, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  };

  // Handle incorrect answer
  const handleIncorrectAnswer = async () => {
    const newStats: ShapeStats = {
      ...shapeStats,
      triangles: {
        ...shapeStats.triangles,
        attempts: shapeStats.triangles.attempts + 1,
        accuracy: calculateAccuracy(
          shapeStats.triangles.completed,
          shapeStats.triangles.attempts + 1
        ),
      },
    };

    await saveStats(newStats);

    setShowAnswer(true);
    Animated.timing(answerAnimation, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  };

  const handleAnswer = async (isCorrect: boolean): Promise<void> => {
    if (isCorrect) {
      await handleCorrectAnswer();
    } else {
      await handleIncorrectAnswer();
    }
  };

  const handleNext = async (): Promise<void> => {
    try {
      setShowAnswer(false);
      answerAnimation.setValue(0);
      if (currentIndex < triangles.length - 1) {
        setCurrentIndex(currentIndex + 1);
      } else {
        // Save final stats before navigating back
        await saveStats(shapeStats);
        Alert.alert("Well Done!", "You've completed the Triangles lesson!", [
          { text: "OK", onPress: () => router.back() },
        ]);
      }
    } catch (error) {
      console.error("Error handling next:", error);
      Alert.alert("Error", "There was a problem saving your progress.");
    }
  };

  const handleShowProperties = async (): Promise<void> => {
    setShowAnswer(true);
    setScore(score + 5);

    const newStats: ShapeStats = {
      ...shapeStats,
      triangles: {
        ...shapeStats.triangles,
        completed: shapeStats.triangles.completed + 1,
        correct: shapeStats.triangles.correct + 1,
        attempts: shapeStats.triangles.attempts + 1,
        accuracy: calculateAccuracy(
          shapeStats.triangles.completed + 1,
          shapeStats.triangles.attempts + 1
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

  const currentShape = triangles[currentIndex];

  // Get color based on triangle type
  const getTypeColor = (type: TriangleType): string => {
    switch (type) {
      case "equilateral":
        return "bg-emerald-500";
      case "isosceles":
        return "bg-blue-500";
      case "right":
        return "bg-amber-500";
      case "scalene":
      default:
        return "bg-pink-500";
    }
  };

  const getTypeText = (type: TriangleType): string => {
    switch (type) {
      case "equilateral":
        return "Equilateral";
      case "isosceles":
        return "Isosceles";
      case "right":
        return "Right";
      case "scalene":
      default:
        return "Scalene";
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-emerald-50">
      <ScrollView className="flex-1 p-4">
        {/* Progress indicator */}
        <View className="mb-4">
          <Text className="text-sm text-slate-500 mb-1">
            Triangle {currentIndex + 1} of {triangles.length}
          </Text>
          <View className="h-2 bg-slate-200 rounded-full overflow-hidden">
            <View
              className="h-full bg-emerald-500 rounded-full"
              style={{
                width: `${((currentIndex + 1) / triangles.length) * 100}%`,
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
              {currentShape.properties.map((property, index) => (
                <View key={index} className="flex-row items-center">
                  <Ionicons name="checkmark-circle" size={20} color="#10B981" />
                  <Text className="text-sm text-slate-500 ml-2 flex-1">
                    {property}
                  </Text>
                </View>
              ))}
            </Animated.View>
          ) : (
            <TouchableOpacity
              className="bg-emerald-500 py-3 rounded-lg items-center"
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
            className="flex-1 flex-row justify-center items-center py-3 rounded-lg bg-emerald-500"
            onPress={handleNext}
          >
            <Text className="text-white text-base font-bold mr-2">
              {currentIndex < triangles.length - 1 ? "Next Triangle" : "Finish"}
            </Text>
            <Ionicons
              name={
                currentIndex < triangles.length - 1
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
              {completed} triangles completed in total
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
