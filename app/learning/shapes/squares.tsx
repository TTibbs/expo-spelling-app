import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Image,
  Animated,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { rectangles } from "@/lib/data";

export default function SquaresScreen() {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [completed, setCompleted] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [answerAnimation] = useState(new Animated.Value(0));

  useEffect(() => {
    // Load progress from AsyncStorage
    const loadProgress = async () => {
      try {
        const shapeStatsStr = await AsyncStorage.getItem("shapeStats");
        if (shapeStatsStr) {
          const shapeStats = JSON.parse(shapeStatsStr);
          setCompleted(shapeStats.squares?.completed || 0);
        }
      } catch (error) {
        console.error("Error loading shape progress:", error);
      }
    };

    loadProgress();
  }, []);

  const saveProgress = async () => {
    try {
      // Update user profile XP
      const userProfileStr = await AsyncStorage.getItem("userProfile");
      if (userProfileStr) {
        const userProfile = JSON.parse(userProfileStr);
        const updatedXp = (userProfile.xp || 0) + 5;
        const updatedProfile = {
          ...userProfile,
          xp: updatedXp,
        };
        await AsyncStorage.setItem(
          "userProfile",
          JSON.stringify(updatedProfile)
        );
      }

      // Update shape statistics
      const shapeStatsStr = await AsyncStorage.getItem("shapeStats");
      let shapeStats = shapeStatsStr
        ? JSON.parse(shapeStatsStr)
        : {
            totalShapes: 0,
            circles: { completed: 0, accuracy: 0 },
            squares: { completed: 0, accuracy: 0 },
            triangles: { completed: 0, accuracy: 0 },
          };

      // Update squares stats
      shapeStats.totalShapes = (shapeStats.totalShapes || 0) + 1;
      shapeStats.squares = shapeStats.squares || { completed: 0, accuracy: 0 };
      shapeStats.squares.completed = (shapeStats.squares.completed || 0) + 1;

      // Calculate new accuracy (if we had questions)
      shapeStats.squares.accuracy = Math.round(
        ((shapeStats.squares.accuracy || 100) + 100) / 2
      );

      await AsyncStorage.setItem("shapeStats", JSON.stringify(shapeStats));
      setCompleted(shapeStats.squares.completed);
    } catch (error) {
      console.error("Error saving progress:", error);
    }
  };

  const handleNext = () => {
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

  const handleShowProperties = () => {
    setShowAnswer(true);
    setScore(score + 5);
    saveProgress();

    Animated.timing(answerAnimation, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  };

  const currentShape = rectangles[currentIndex];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Progress indicator */}
        <View style={styles.progressContainer}>
          <Text style={styles.progressText}>
            Shape {currentIndex + 1} of {rectangles.length}
          </Text>
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                { width: `${((currentIndex + 1) / rectangles.length) * 100}%` },
              ]}
            />
          </View>
        </View>

        {/* Shape image */}
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: currentShape.image }}
            style={styles.shapeImage}
            resizeMode="cover"
          />
          <View style={styles.labelContainer}>
            <Text style={styles.shapeLabel}>{currentShape.name}</Text>
            <View
              style={[
                styles.typeTag,
                {
                  backgroundColor:
                    currentShape.type === "square" ? "#8B5CF6" : "#6366F1",
                },
              ]}
            >
              <Text style={styles.typeText}>
                {currentShape.type === "square" ? "Square" : "Rectangle"}
              </Text>
            </View>
          </View>
        </View>

        {/* Shape description */}
        <View style={styles.descriptionContainer}>
          <Text style={styles.descriptionTitle}>Description</Text>
          <Text style={styles.description}>{currentShape.description}</Text>
        </View>

        {/* Properties section */}
        <View style={styles.propertiesContainer}>
          <Text style={styles.propertiesTitle}>Properties</Text>

          {showAnswer ? (
            <Animated.View
              style={[
                styles.propertiesList,
                {
                  opacity: answerAnimation,
                  transform: [
                    {
                      translateY: answerAnimation.interpolate({
                        inputRange: [0, 1],
                        outputRange: [20, 0],
                      }),
                    },
                  ],
                },
              ]}
            >
              {currentShape.properties.map((property, index) => (
                <View key={index} style={styles.propertyItem}>
                  <Ionicons name="checkmark-circle" size={20} color="#10B981" />
                  <Text style={styles.propertyText}>{property}</Text>
                </View>
              ))}
            </Animated.View>
          ) : (
            <TouchableOpacity
              style={styles.revealButton}
              onPress={handleShowProperties}
            >
              <Text style={styles.revealButtonText}>Reveal Properties</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Navigation buttons */}
        <View style={styles.buttonsContainer}>
          <TouchableOpacity
            style={[styles.navButton, { backgroundColor: "#8B5CF6" }]}
            onPress={handleNext}
          >
            <Text style={styles.navButtonText}>
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
        <View style={styles.scoreContainer}>
          <Text style={styles.scoreLabel}>Score:</Text>
          <Text style={styles.scoreValue}>{score} XP</Text>
        </View>

        {/* Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Ionicons name="eye-outline" size={20} color="#64748B" />
            <Text style={styles.statText}>
              {completed} shapes completed in total
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#EDE9FE",
  },
  scrollContent: {
    padding: 16,
  },
  progressContainer: {
    marginBottom: 16,
  },
  progressText: {
    fontSize: 14,
    color: "#64748B",
    marginBottom: 4,
  },
  progressBar: {
    height: 8,
    backgroundColor: "#E2E8F0",
    borderRadius: 4,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#8B5CF6",
    borderRadius: 4,
  },
  imageContainer: {
    height: 200,
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 16,
  },
  shapeImage: {
    width: "100%",
    height: "100%",
  },
  labelContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0,0,0,0.6)",
    padding: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  shapeLabel: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
  },
  typeTag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  typeText: {
    fontSize: 12,
    fontWeight: "bold",
    color: "white",
  },
  descriptionContainer: {
    backgroundColor: "white",
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  descriptionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1E293B",
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: "#64748B",
    lineHeight: 20,
  },
  propertiesContainer: {
    backgroundColor: "white",
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  propertiesTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1E293B",
    marginBottom: 12,
  },
  propertiesList: {},
  propertyItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  propertyText: {
    fontSize: 14,
    color: "#64748B",
    marginLeft: 8,
    flex: 1,
  },
  revealButton: {
    backgroundColor: "#8B5CF6",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  revealButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  buttonsContainer: {
    flexDirection: "row",
    marginBottom: 16,
  },
  navButton: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 12,
    borderRadius: 8,
  },
  navButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    marginRight: 8,
  },
  scoreContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    marginBottom: 16,
  },
  scoreLabel: {
    fontSize: 16,
    color: "#64748B",
    marginRight: 4,
  },
  scoreValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#10B981",
  },
  statsContainer: {
    backgroundColor: "#F1F5F9",
    padding: 12,
    borderRadius: 8,
  },
  statItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  statText: {
    fontSize: 14,
    color: "#64748B",
    marginLeft: 8,
  },
});
