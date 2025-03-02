import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SubtractionEquationProps, MathEquation } from "@/types/numbers";

const Equation = ({
  num1,
  num2,
  answer,
  selectedAnswer,
  onSelect,
}: SubtractionEquationProps) => {
  const options = [answer, answer + 1, answer - 1].sort(
    () => Math.random() - 0.5
  );

  return (
    <View style={styles.equationContainer}>
      <View style={styles.equation}>
        <Text style={styles.equationText}>{num1}</Text>
        <View style={styles.operationContainer}>
          <Ionicons name="remove" size={36} color="#F59E0B" />
        </View>
        <Text style={styles.equationText}>{num2}</Text>
        <Text style={styles.equationText}>=</Text>
        <Text style={styles.equationText}>?</Text>
      </View>

      <View style={styles.visualContainer}>
        <View style={styles.numberVisual}>
          {/* First show all dots */}
          {[...Array(num1)].map((_, i) => (
            <View
              key={`num1-${i}`}
              style={[styles.dot, i >= num1 - num2 && styles.crossedDot]}
            />
          ))}
        </View>

        <View style={styles.operationVisual}>
          <Ionicons name="remove" size={24} color="#F59E0B" />
        </View>

        <View style={styles.numberVisual}>
          {[...Array(num2)].map((_, i) => (
            <View key={`num2-${i}`} style={styles.crossedDot} />
          ))}
        </View>

        <View style={styles.equalsVisual}>
          <Text style={styles.equalsText}>=</Text>
        </View>

        <View style={styles.resultVisual}>
          {/* This shows what remains after subtraction */}
          {[...Array(answer)].map((_, i) => (
            <View key={`result-${i}`} style={styles.dot} />
          ))}
        </View>
      </View>

      <View style={styles.answersContainer}>
        {options.map((option, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.answerButton,
              selectedAnswer === option && styles.selectedAnswer,
              selectedAnswer === option &&
                option === answer &&
                styles.correctAnswer,
              selectedAnswer === option &&
                option !== answer &&
                styles.incorrectAnswer,
            ]}
            onPress={() => onSelect(option)}
            disabled={selectedAnswer !== null}
          >
            <Text
              style={[
                styles.answerText,
                selectedAnswer === option &&
                  option === answer &&
                  styles.correctAnswerText,
                selectedAnswer === option &&
                  option !== answer &&
                  styles.incorrectAnswerText,
              ]}
            >
              {option}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

export default function SubtractionScreen() {
  const [currentEquation, setCurrentEquation] = useState<MathEquation>({
    num1: 5,
    num2: 2,
    answer: 3,
  });
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [level, setLevel] = useState(1);
  const [showCelebration, setShowCelebration] = useState(false);
  const scaleAnim = useState(new Animated.Value(1))[0];

  useEffect(() => {
    generateNewEquation();
  }, [level]);

  const generateNewEquation = () => {
    // Difficulty increases with level
    const maxNum = Math.min(5 + level, 20);

    // For subtraction, we need num1 >= num2
    const num1 = Math.floor(Math.random() * maxNum) + 2; // ensure at least 2
    const num2 = Math.floor(Math.random() * num1); // ensure num2 <= num1
    const answer = num1 - num2;

    setCurrentEquation({ num1, num2, answer });
    setSelectedAnswer(null);
    setIsCorrect(null);
  };

  const handleAnswerSelect = async (answer: number) => {
    const correct = answer === currentEquation.answer;
    setIsCorrect(correct);

    if (correct) {
      setScore(score + 10);
      setStreak(streak + 1);

      // Scale animation for correct answer
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.2,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();

      // Level up logic
      if (streak > 0 && streak % 5 === 0) {
        setLevel((prevLevel) => Math.min(prevLevel + 1, 10));
        setShowCelebration(true);
        setTimeout(() => setShowCelebration(false), 3000);
      }

      // Save progress - updated to store more detailed statistics
      try {
        // Update user profile XP
        const userProfileStr = await AsyncStorage.getItem("userProfile");
        if (userProfileStr) {
          const userProfile = JSON.parse(userProfileStr);
          const updatedXp = (userProfile.xp || 0) + 10;
          const updatedProfile = {
            ...userProfile,
            xp: updatedXp,
          };
          await AsyncStorage.setItem(
            "userProfile",
            JSON.stringify(updatedProfile)
          );
        }

        // Update math statistics
        const mathStatsStr = await AsyncStorage.getItem("mathStats");
        let mathStats = mathStatsStr
          ? JSON.parse(mathStatsStr)
          : {
              totalProblems: 0,
              correctAnswers: 0,
              highestStreak: 0,
              addition: { completed: 0, accuracy: 0 },
              subtraction: { completed: 0, accuracy: 0 },
              counting: { completed: 0, accuracy: 0 },
            };

        // Update subtraction stats
        mathStats.totalProblems += 1;
        mathStats.correctAnswers += 1;
        mathStats.subtraction.completed += 1;

        // Calculate new accuracy
        const subtractionAccuracy = Math.round(
          (mathStats.subtraction.completed /
            (mathStats.subtraction.completed + (correct ? 0 : 1))) *
            100
        );
        mathStats.subtraction.accuracy = subtractionAccuracy;

        // Update highest streak if current streak is higher
        if (streak > mathStats.highestStreak) {
          mathStats.highestStreak = streak;
        }

        // Save updated math stats
        await AsyncStorage.setItem("mathStats", JSON.stringify(mathStats));
      } catch (error) {
        console.error("Failed to update stats:", error);
      }
    } else {
      setStreak(0);

      // Update math statistics for incorrect answer
      try {
        const mathStatsStr = await AsyncStorage.getItem("mathStats");
        if (mathStatsStr) {
          const mathStats = JSON.parse(mathStatsStr);
          mathStats.totalProblems += 1;
          // Don't increment correct answers count

          // Calculate new accuracy
          const totalSubtraction = (mathStats.subtraction.completed || 0) + 1;
          const correctSubtraction = mathStats.correctAnswers || 0;
          const newAccuracy = Math.round(
            (correctSubtraction / totalSubtraction) * 100
          );

          mathStats.subtraction = {
            completed: totalSubtraction,
            accuracy: newAccuracy,
          };

          await AsyncStorage.setItem("mathStats", JSON.stringify(mathStats));
        }
      } catch (error) {
        console.error("Failed to update stats:", error);
      }
    }

    setSelectedAnswer(answer);

    // Wait before generating new equation
    setTimeout(() => {
      generateNewEquation();
    }, 1500);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Progress bar */}
      <View style={styles.progressContainer}>
        <View style={styles.scoreContainer}>
          <Ionicons name="star" size={20} color="#F59E0B" />
          <Text style={styles.scoreText}>{score}</Text>
        </View>
        <View style={styles.levelContainer}>
          <Text style={styles.levelText}>Level {level}</Text>
        </View>
        <View style={styles.streakContainer}>
          <Ionicons name="flame" size={20} color="#EF4444" />
          <Text style={styles.streakText}>{streak}</Text>
        </View>
      </View>

      {/* Main content */}
      <View style={styles.content}>
        <Animated.View
          style={[
            styles.equationWrapper,
            { transform: [{ scale: scaleAnim }] },
          ]}
        >
          <Equation
            num1={currentEquation.num1}
            num2={currentEquation.num2}
            answer={currentEquation.answer}
            selectedAnswer={selectedAnswer}
            onSelect={handleAnswerSelect}
          />
        </Animated.View>

        {/* Instructions for kids */}
        <View style={styles.instructionsContainer}>
          <Text style={styles.instructionTitle}>How to Subtract:</Text>
          <Text style={styles.instructionText}>
            Start with the top number, then take away (subtract) the bottom
            number!
          </Text>
        </View>

        {/* Feedback icon */}
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
              {isCorrect ? "Great job!" : "Let's try again!"}
            </Text>
          </View>
        )}

        {/* Level up celebration */}
        {showCelebration && (
          <View style={styles.celebrationContainer}>
            <Text style={styles.celebrationText}>Level Up!</Text>
            <Text style={styles.celebrationSubtext}>
              You're now level {level}!
            </Text>
            <Ionicons name="trophy" size={48} color="#F59E0B" />
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FEF3C7",
  },
  progressContainer: {
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
  levelContainer: {
    backgroundColor: "#F59E0B",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
  },
  levelText: {
    color: "white",
    fontWeight: "bold",
  },
  streakContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  streakText: {
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 4,
    color: "#1E293B",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  equationWrapper: {
    width: "100%",
  },
  equationContainer: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  equation: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
  },
  equationText: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#1E293B",
    marginHorizontal: 8,
  },
  operationContainer: {
    marginHorizontal: 8,
  },
  visualContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
    flexWrap: "wrap",
  },
  numberVisual: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    width: 100,
    marginHorizontal: 4,
  },
  operationVisual: {
    marginHorizontal: 4,
  },
  equalsVisual: {
    marginHorizontal: 4,
  },
  equalsText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1E293B",
  },
  resultVisual: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    width: 100,
    marginHorizontal: 4,
  },
  dot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: "#F59E0B",
    margin: 4,
  },
  crossedDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: "#CBD5E1",
    margin: 4,
    opacity: 0.5,
  },
  answersContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  answerButton: {
    backgroundColor: "white",
    borderWidth: 2,
    borderColor: "#F59E0B",
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 24,
    minWidth: 80,
    alignItems: "center",
  },
  selectedAnswer: {
    borderWidth: 2,
  },
  correctAnswer: {
    backgroundColor: "#10B981",
    borderColor: "#10B981",
  },
  incorrectAnswer: {
    backgroundColor: "#EF4444",
    borderColor: "#EF4444",
  },
  answerText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1E293B",
  },
  correctAnswerText: {
    color: "white",
  },
  incorrectAnswerText: {
    color: "white",
  },
  instructionsContainer: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 16,
    marginVertical: 16,
    width: "100%",
  },
  instructionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1E293B",
    marginBottom: 8,
  },
  instructionText: {
    fontSize: 14,
    color: "#64748B",
    lineHeight: 20,
  },
  feedbackContainer: {
    position: "absolute",
    alignItems: "center",
    bottom: 40,
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
