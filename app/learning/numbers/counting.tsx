import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  FlatList,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Audio } from "expo-av";
import { NumberItemProps, NumberVisualProps } from "@/types/numbers";
import { themes } from "@/lib/data";
import { getData, storeData, StorageKeys } from "@/lib/storage";

// Number item component
const NumberItem = ({
  number,
  onPress,
  selected,
  correct,
}: NumberItemProps) => {
  return (
    <TouchableOpacity
      style={[
        styles.numberItem,
        selected && styles.selectedItem,
        selected && correct === true && styles.correctItem,
        selected && correct === false && styles.incorrectItem,
      ]}
      onPress={() => onPress(number)}
      disabled={selected}
    >
      <Text
        style={[
          styles.numberText,
          selected && correct === true && styles.correctText,
          selected && correct === false && styles.incorrectText,
        ]}
      >
        {number}
      </Text>
    </TouchableOpacity>
  );
};

// Number visuals - displays objects to count
const NumberVisual = ({ count, icon, color }: NumberVisualProps) => {
  return (
    <View style={styles.visualContainer}>
      {[...Array(count)].map((_, index) => (
        <View key={index} style={styles.iconWrapper}>
          <Ionicons name={icon as any} size={32} color={color} />
        </View>
      ))}
    </View>
  );
};

export default function CountingScreen() {
  const [currentNumber, setCurrentNumber] = useState(1);
  const [selectedNumber, setSelectedNumber] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);
  const scaleAnim = useState(new Animated.Value(1))[0];
  const [currentTheme, setCurrentTheme] = useState(themes[0]);
  const [soundEffect, setSoundEffect] = useState<Audio.Sound | null>(null);

  useEffect(() => {
    generateNewQuestion();
  }, []);

  const generateNewQuestion = () => {
    // Generate a random number between 1 and 10 for beginners
    const number = Math.floor(Math.random() * 10) + 1;
    setCurrentNumber(number);
    setSelectedNumber(null);
    setIsCorrect(null);

    // Pick a random theme
    const themeIndex = Math.floor(Math.random() * themes.length);
    setCurrentTheme(themes[themeIndex]);
  };

  // Play sound effect
  const playSound = async (type: "correct" | "incorrect") => {
    try {
      // Unload previous sound if exists
      if (soundEffect) {
        await soundEffect.unloadAsync();
      }

      // Select the appropriate sound file
      const soundFile =
        type === "correct"
          ? require("../../../assets/sounds/correct.mp3")
          : require("../../../assets/sounds/incorrect.mp3");

      // Load and play the sound
      const { sound } = await Audio.Sound.createAsync(soundFile);
      setSoundEffect(sound);
      await sound.playAsync();
    } catch (error) {
      console.error("Failed to play sound:", error);
    }
  };

  // Clean up sound effect on unmount
  useEffect(() => {
    return () => {
      if (soundEffect) {
        soundEffect.unloadAsync();
      }
    };
  }, [soundEffect]);

  const handleNumberPress = async (number: number) => {
    setSelectedNumber(number);
    const correct = number === currentNumber;
    setIsCorrect(correct);

    if (correct) {
      playSound("correct");
      setScore(score + 5);
      setStreak(streak + 1);

      // Animate on correct answer
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();

      // Save progress using type-safe storage
      try {
        // Update user profile XP
        const userProfile = await getData(StorageKeys.USER_PROFILE);
        if (userProfile) {
          const updatedXp = (userProfile.xp || 0) + 5;
          const updatedProfile = {
            ...userProfile,
            xp: updatedXp,
          };
          await storeData(StorageKeys.USER_PROFILE, updatedProfile);
        }

        // Update math statistics
        const mathStats = (await getData(StorageKeys.MATH_STATS)) || {
          totalProblems: 0,
          correctAnswers: 0,
          streak: 0,
          highestStreak: 0,
          addition: { attempted: 0, correct: 0, accuracy: 0 },
          subtraction: { attempted: 0, correct: 0, accuracy: 0 },
          counting: { attempted: 0, correct: 0, accuracy: 0 },
        };

        // Update counting stats
        mathStats.totalProblems += 1;
        mathStats.correctAnswers += 1;
        mathStats.counting.attempted += 1;
        mathStats.counting.correct += 1;

        // Calculate new accuracy
        const countingAccuracy = Math.round(
          (mathStats.counting.correct / mathStats.counting.attempted) * 100
        );
        mathStats.counting.accuracy = countingAccuracy;

        // Update highest streak if current streak is higher
        if (streak > mathStats.highestStreak) {
          mathStats.highestStreak = streak;
        }
        mathStats.streak = streak;

        // Save updated math stats
        await storeData(StorageKeys.MATH_STATS, mathStats);
      } catch (error) {
        console.error(
          "Failed to update stats:",
          error instanceof Error ? error.message : "Unknown error"
        );
      }

      // Check for milestone
      if (streak > 0 && streak % 10 === 0) {
        setShowCelebration(true);
        setTimeout(() => setShowCelebration(false), 3000);
      }
    } else {
      playSound("incorrect");
      setStreak(0);

      // Update math statistics for incorrect answer
      try {
        const mathStats = (await getData(StorageKeys.MATH_STATS)) || {
          totalProblems: 0,
          correctAnswers: 0,
          streak: 0,
          highestStreak: 0,
          addition: { attempted: 0, correct: 0, accuracy: 0 },
          subtraction: { attempted: 0, correct: 0, accuracy: 0 },
          counting: { attempted: 0, correct: 0, accuracy: 0 },
        };

        mathStats.totalProblems += 1;
        mathStats.counting.attempted += 1;
        // Don't increment correct answers or correct count

        // Calculate new accuracy
        const newAccuracy = Math.round(
          (mathStats.counting.correct / mathStats.counting.attempted) * 100
        );

        mathStats.counting.accuracy = newAccuracy;
        mathStats.streak = 0; // Reset streak on incorrect answer

        await storeData(StorageKeys.MATH_STATS, mathStats);
      } catch (error) {
        console.error(
          "Failed to update stats:",
          error instanceof Error ? error.message : "Unknown error"
        );
      }
    }

    // Generate new number after a delay
    setTimeout(() => {
      generateNewQuestion();
      setSelectedNumber(null);
      setIsCorrect(null);
    }, 1500);
  };

  // Generate numbers 1-20 for selection
  const numbers = Array.from({ length: 20 }, (_, i) => i + 1);

  return (
    <SafeAreaView style={styles.container}>
      {/* Header with score */}
      <View style={styles.header}>
        <View style={styles.scoreContainer}>
          <Ionicons name="star" size={20} color="#F59E0B" />
          <Text style={styles.scoreText}>{score} points</Text>
        </View>

        <View style={styles.streakContainer}>
          <Ionicons name="flame" size={20} color="#EF4444" />
          <Text style={styles.streakText}>{streak}</Text>
        </View>
      </View>

      {/* Question - "Count the items" */}
      <View style={styles.questionContainer}>
        <Text style={styles.questionText}>How many items do you see?</Text>
        <Text style={styles.questionLabel}>Count them!</Text>
      </View>

      {/* Visual representation - items to count */}
      <Animated.View
        style={[styles.visualWrapper, { transform: [{ scale: scaleAnim }] }]}
      >
        <NumberVisual
          count={currentNumber}
          icon={currentTheme.icon}
          color={currentTheme.color}
        />
      </Animated.View>

      {/* Number selection */}
      <View style={styles.numberSelectionContainer}>
        <Text style={styles.selectionLabel}>Pick the correct number:</Text>

        <FlatList
          data={numbers}
          numColumns={5}
          renderItem={({ item }) => (
            <NumberItem
              number={item}
              onPress={handleNumberPress}
              selected={selectedNumber === item}
              correct={selectedNumber === item ? isCorrect : null}
            />
          )}
          keyExtractor={(item) => item.toString()}
          contentContainerStyle={styles.numberGrid}
        />
      </View>

      {/* Feedback message */}
      {isCorrect !== null && (
        <View style={styles.feedbackContainer}>
          <Ionicons
            name={isCorrect ? "checkmark-circle" : "close-circle"}
            size={48}
            color={isCorrect ? "#10B981" : "#EF4444"}
          />
          <Text
            style={[
              styles.feedbackText,
              { color: isCorrect ? "#10B981" : "#EF4444" },
            ]}
          >
            {isCorrect
              ? "Great counting!"
              : `That's ${selectedNumber}. Let's try again!`}
          </Text>
        </View>
      )}

      {/* Celebration overlay */}
      {showCelebration && (
        <View style={styles.celebrationContainer}>
          <Text style={styles.celebrationText}>Amazing!</Text>
          <Text style={styles.celebrationSubtext}>
            You got {streak} correct in a row!
          </Text>
          <Ionicons name="trophy" size={64} color="#F59E0B" />
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ECFDF5",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
  },
  scoreContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  scoreText: {
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 4,
    color: "#1E293B",
  },
  streakContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FEE2E2",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
  },
  streakText: {
    fontSize: 14,
    fontWeight: "bold",
    marginLeft: 4,
    color: "#EF4444",
  },
  questionContainer: {
    alignItems: "center",
    marginVertical: 16,
  },
  questionText: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#1E293B",
  },
  questionLabel: {
    fontSize: 16,
    color: "#64748B",
    marginTop: 8,
  },
  visualWrapper: {
    alignItems: "center",
    marginVertical: 16,
  },
  visualContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    padding: 16,
    backgroundColor: "white",
    borderRadius: 16,
    maxWidth: "90%",
    marginHorizontal: "5%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  iconWrapper: {
    margin: 6,
  },
  numberSelectionContainer: {
    flex: 1,
    marginTop: 16,
    paddingHorizontal: 16,
  },
  selectionLabel: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1E293B",
    marginBottom: 12,
  },
  numberGrid: {
    paddingBottom: 32,
  },
  numberItem: {
    width: "18%",
    aspectRatio: 1,
    margin: "1%",
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#10B981",
  },
  selectedItem: {
    borderWidth: 2,
  },
  correctItem: {
    backgroundColor: "#10B981",
    borderColor: "#10B981",
  },
  incorrectItem: {
    backgroundColor: "#EF4444",
    borderColor: "#EF4444",
  },
  numberText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1E293B",
  },
  correctText: {
    color: "white",
  },
  incorrectText: {
    color: "white",
  },
  feedbackContainer: {
    position: "absolute",
    bottom: 40,
    left: 0,
    right: 0,
    alignItems: "center",
  },
  feedbackText: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 8,
  },
  celebrationContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    zIndex: 10,
  },
  celebrationText: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#F59E0B",
    marginBottom: 8,
  },
  celebrationSubtext: {
    fontSize: 18,
    color: "#1E293B",
    marginBottom: 16,
  },
});
