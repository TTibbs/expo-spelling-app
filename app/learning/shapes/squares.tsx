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
import { Rectangle, RectangleType } from "@/types/shapes";
import {
  updateShapeCategoryStats,
  loadShapeStats,
  ShapeStorageError,
} from "@/lib/shapeUtils";
import { getData, storeData, StorageKeys } from "@/lib/storage";

// Filter rectangles from shapes array
const rectangles = shapes.filter(
  (shape): shape is Rectangle =>
    shape.type === "square" || shape.type === "rectangle"
);

/**
 * SquaresScreen component - displays educational content about squares and rectangles
 * Allows users to browse through different rectangle shapes and learn their properties
 * @returns JSX.Element representing the squares and rectangles learning screen
 */
export default function SquaresScreen(): JSX.Element {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [completed, setCompleted] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [answerAnimation] = useState(new Animated.Value(0));

  useEffect(() => {
    /**
     * Loads progress data from storage using our type-safe utilities
     * Sets the completed state based on existing progress data
     */
    const loadProgress = async (): Promise<void> => {
      try {
        const shapeStats = await loadShapeStats();
        setCompleted(shapeStats.squares.completed);
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

  /**
   * Saves the user's progress and adds XP to their profile
   * Updates shape statistics using our type-safe storage utilities
   * @throws ShapeStorageError if there's an issue saving data
   */
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
      const shapeStats = await updateShapeCategoryStats("squares");
      setCompleted(shapeStats.squares.completed);
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

  /**
   * Handles navigation to the next shape or completes the lesson
   * Shows completion alert when all shapes have been viewed
   */
  const handleNext = (): void => {
    if (currentIndex < rectangles.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setShowAnswer(false);
      answerAnimation.setValue(0);
    } else {
      // Completed all shapes
      Alert.alert(
        "Well Done!",
        "You've completed the Squares & Rectangles lesson!",
        [{ text: "OK", onPress: () => router.back() }]
      );
    }
  };

  /**
   * Handles the "Show Properties" button press
   * Reveals the shape properties with animation
   * Saves progress and adds to score
   */
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

  /**
   * Returns a color based on the rectangle type
   * @param type - The type of rectangle
   * @returns A Tailwind color class
   */
  const getTypeColor = (type: RectangleType): string => {
    switch (type) {
      case "square":
        return "bg-blue-500";
      case "rectangle":
        return "bg-emerald-500";
      default:
        return "bg-pink-500";
    }
  };

  /**
   * Returns the display text for a rectangle type
   * @param type - The type of rectangle
   * @returns The formatted display text
   */
  const getTypeText = (type: RectangleType): string => {
    switch (type) {
      case "square":
        return "Square";
      case "rectangle":
        return "Rectangle";
      default:
        return "Unknown";
    }
  };

  const currentShape = rectangles[currentIndex];

  return (
    <SafeAreaView className="flex-1 bg-violet-50">
      <ScrollView className="flex-1 p-4">
        {/* Progress indicator */}
        <View className="mb-4">
          <Text className="text-sm text-slate-500 mb-1">
            Shape {currentIndex + 1} of {rectangles.length}
          </Text>
          <View className="h-2 bg-slate-200 rounded-full overflow-hidden">
            <View
              className="h-full bg-violet-500 rounded-full"
              style={{
                width: `${((currentIndex + 1) / rectangles.length) * 100}%`,
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
                      color="#10B981"
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
              className="bg-violet-500 py-3 rounded-lg items-center"
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
            className="flex-1 flex-row justify-center items-center py-3 rounded-lg bg-violet-500"
            onPress={handleNext}
          >
            <Text className="text-white text-base font-bold mr-2">
              {currentIndex < rectangles.length - 1 ? "Next Shape" : "Finish"}
            </Text>
            <Ionicons
              name={
                currentIndex < rectangles.length - 1
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
