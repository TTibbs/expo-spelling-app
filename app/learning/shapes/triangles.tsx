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

export default function TrianglesScreen(): JSX.Element {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [completed, setCompleted] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [answerAnimation] = useState(new Animated.Value(0));

  useEffect(() => {
    // Load progress from storage using type-safe functions
    const loadProgress = async (): Promise<void> => {
      try {
        const shapeStats = await getData(StorageKeys.SHAPE_STATS);
        if (shapeStats) {
          setCompleted(shapeStats.triangles.completed || 0);
        }
      } catch (error) {
        console.error(
          "Error loading shape progress:",
          error instanceof Error ? error.message : "Unknown error"
        );
      }
    };

    loadProgress();
  }, []);

  const saveProgress = async (): Promise<void> => {
    try {
      // Update user profile XP with type-safe storage
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
      const shapeStats = await updateShapeCategoryStats("triangles");
      setCompleted(shapeStats.triangles.completed);
    } catch (error) {
      const errorMessage =
        error instanceof ShapeStorageError
          ? error.message
          : "Unknown error saving progress";

      console.error("Failed to save progress:", errorMessage);
      Alert.alert("Error", "Failed to save your progress.");
    }
  };

  const handleNext = (): void => {
    if (currentIndex < triangles.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setShowAnswer(false);
      answerAnimation.setValue(0);
    } else {
      // Completed all shapes
      Alert.alert("Well Done!", "You've completed the Triangles lesson!", [
        { text: "OK", onPress: () => router.back() },
      ]);
    }
  };

  const handleShowProperties = (): void => {
    setShowAnswer(true);
    setScore(score + 5);
    saveProgress();

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
