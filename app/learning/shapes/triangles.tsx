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
        return "#10B981";
      case "isosceles":
        return "#3B82F6";
      case "right":
        return "#F59E0B";
      case "scalene":
      default:
        return "#EC4899";
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
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Progress indicator */}
        <View style={styles.progressContainer}>
          <Text style={styles.progressText}>
            Triangle {currentIndex + 1} of {triangles.length}
          </Text>
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                { width: `${((currentIndex + 1) / triangles.length) * 100}%` },
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
                  backgroundColor: getTypeColor(currentShape.type),
                },
              ]}
            >
              <Text style={styles.typeText}>
                {getTypeText(currentShape.type)}
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
            style={[styles.navButton, { backgroundColor: "#10B981" }]}
            onPress={handleNext}
          >
            <Text style={styles.navButtonText}>
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
        <View style={styles.scoreContainer}>
          <Text style={styles.scoreLabel}>Score:</Text>
          <Text style={styles.scoreValue}>{score} XP</Text>
        </View>

        {/* Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Ionicons name="eye-outline" size={20} color="#64748B" />
            <Text style={styles.statText}>
              {completed} triangles completed in total
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
    backgroundColor: "#ECFDF5",
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
    backgroundColor: "#10B981",
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
    backgroundColor: "#10B981",
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
