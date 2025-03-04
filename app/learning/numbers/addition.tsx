import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, Animated } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Audio } from "expo-av";
import { AdditionEquationProps, MathEquation } from "@/types/numbers";
import {
  getData,
  storeData,
  StorageKeys,
  updateRewardProgress,
} from "@/lib/storage";
import { useChild } from "@/context/ChildContext";

const Equation = ({
  num1,
  num2,
  answer,
  selectedAnswer,
  onSelect,
}: AdditionEquationProps) => {
  const options = [answer, answer + 1, answer - 1].sort(
    () => Math.random() - 0.5
  );

  return (
    <View className="bg-white rounded-2xl p-4 mb-4 shadow-sm">
      <View className="flex-row justify-center items-center mb-6">
        <Text className="text-4xl font-bold text-slate-800 mx-2">{num1}</Text>
        <View className="mx-2">
          <Ionicons name="add" size={36} color="#10B981" />
        </View>
        <Text className="text-4xl font-bold text-slate-800 mx-2">{num2}</Text>
        <Text className="text-4xl font-bold text-slate-800 mx-2">=</Text>
        <Text className="text-4xl font-bold text-slate-800 mx-2">?</Text>
      </View>

      <View className="flex-row justify-center items-center mb-6">
        <View className="flex-row flex-wrap justify-center w-30 mx-2">
          {[...Array(num1)].map((_, i) => (
            <View
              key={`num1-${i}`}
              className="w-4 h-4 rounded-full bg-emerald-500 m-1"
            />
          ))}
        </View>
        <View className="mx-2">
          <Ionicons name="add" size={24} color="#10B981" />
        </View>
        <View className="flex-row flex-wrap justify-center w-30 mx-2">
          {[...Array(num2)].map((_, i) => (
            <View
              key={`num2-${i}`}
              className="w-4 h-4 rounded-full bg-emerald-500 m-1"
            />
          ))}
        </View>
      </View>

      <View className="flex-row justify-around">
        {options.map((option, index) => (
          <TouchableOpacity
            key={index}
            className={`bg-white border-2 border-emerald-500 rounded-xl py-3 px-6 min-w-[80px] items-center ${
              selectedAnswer === option
                ? option === answer
                  ? "bg-emerald-500 border-emerald-500"
                  : "bg-red-500 border-red-500"
                : ""
            }`}
            onPress={() => onSelect(option)}
            disabled={selectedAnswer !== null}
          >
            <Text
              className={`text-2xl font-bold ${
                selectedAnswer === option ? "text-white" : "text-slate-800"
              }`}
            >
              {option}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

export default function AdditionScreen() {
  const { activeChild } = useChild();
  const [currentEquation, setCurrentEquation] = useState<MathEquation>({
    num1: 1,
    num2: 1,
    answer: 2,
    operator: "+",
    difficulty: "easy",
  });
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [level, setLevel] = useState(1);
  const [showCelebration, setShowCelebration] = useState(false);
  const scaleAnim = useState(new Animated.Value(1))[0];
  const [soundEffect, setSoundEffect] = useState<Audio.Sound | null>(null);

  useEffect(() => {
    generateNewEquation();
  }, [level]);

  const generateNewEquation = () => {
    // Difficulty increases with level
    const maxNum = Math.min(5 + level, 20);

    // Generate random numbers based on level
    const num1 = Math.floor(Math.random() * maxNum) + 1;
    const num2 = Math.floor(Math.random() * maxNum) + 1;
    const answer = num1 + num2;

    setCurrentEquation({
      num1,
      num2,
      answer,
      operator: "+",
      difficulty: "easy",
    });
    setSelectedAnswer(null);
    setIsCorrect(null);
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

  const handleAnswerSelect = async (answer: number) => {
    if (!currentEquation) return;

    const correct = answer === currentEquation.answer;
    setIsCorrect(correct);

    if (correct) {
      playSound("correct");
      setScore(score + 10);
      setStreak(streak + 1);

      // Update reward progress
      await updateRewardProgress("math_problems", 1, activeChild?.id);

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

      // Update math statistics
      const mathStats = activeChild
        ? ((await getData(StorageKeys.CHILD_MATH_STATS)) || {})[
            activeChild.id
          ] || {
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
          }
        : (await getData(StorageKeys.MATH_STATS)) || {
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
          };

      // Update addition stats
      mathStats.totalProblems += 1;
      mathStats.correctAnswers += 1;
      mathStats.addition.attempted += 1;
      mathStats.addition.correct += 1;

      // Calculate new accuracy
      const additionAccuracy = Math.round(
        (mathStats.addition.correct / mathStats.addition.attempted) * 100
      );
      mathStats.addition.accuracy = additionAccuracy;

      // Update highest streak if current streak is higher
      if (streak + 1 > mathStats.highestStreak) {
        mathStats.highestStreak = streak + 1;
      }
      mathStats.streak = streak;

      // Save updated math stats
      if (activeChild) {
        const childMathStats =
          (await getData(StorageKeys.CHILD_MATH_STATS)) || {};
        childMathStats[activeChild.id] = mathStats;
        await storeData(StorageKeys.CHILD_MATH_STATS, childMathStats);
      } else {
        await storeData(StorageKeys.MATH_STATS, mathStats);
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
        };

        // Update addition stats
        mathStats.totalProblems += 1;
        mathStats.addition.attempted += 1;
        // Don't increment correct answers or correct count

        // Calculate new accuracy
        const newAccuracy = Math.round(
          (mathStats.addition.correct / mathStats.addition.attempted) * 100
        );
        mathStats.addition.accuracy = newAccuracy;
        mathStats.streak = 0; // Reset streak on incorrect answer

        // Save updated math stats
        if (activeChild) {
          const childMathStats =
            (await getData(StorageKeys.CHILD_MATH_STATS)) || {};
          childMathStats[activeChild.id] = mathStats;
          await storeData(StorageKeys.CHILD_MATH_STATS, childMathStats);
        } else {
          await storeData(StorageKeys.MATH_STATS, mathStats);
        }
      } catch (error) {
        console.error(
          "Failed to update stats:",
          error instanceof Error ? error.message : "Unknown error"
        );
      }
    }

    setSelectedAnswer(answer);

    // Wait before generating new equation
    setTimeout(() => {
      generateNewEquation();
    }, 1500);
  };

  return (
    <SafeAreaView className="flex-1 bg-emerald-50">
      {/* Progress bar */}
      <View className="flex-row justify-between items-center p-4 bg-white border-b border-slate-200">
        <View className="flex-row items-center">
          <Ionicons name="star" size={20} color="#F59E0B" />
          <Text className="text-base font-bold text-slate-800 ml-1">
            {score}
          </Text>
        </View>
        <View className="bg-emerald-500 px-3 py-1 rounded-full">
          <Text className="text-white font-bold">Level {level}</Text>
        </View>
        <View className="flex-row items-center">
          <Ionicons name="flame" size={20} color="#EF4444" />
          <Text className="text-base font-bold text-slate-800 ml-1">
            {streak}
          </Text>
        </View>
      </View>

      {/* Main content */}
      <View className="flex-1 justify-center items-center p-4">
        <Animated.View
          className="w-full"
          style={{ transform: [{ scale: scaleAnim }] }}
        >
          <Equation
            num1={currentEquation.num1}
            num2={currentEquation.num2}
            answer={currentEquation.answer}
            selectedAnswer={selectedAnswer}
            onSelect={handleAnswerSelect}
          />
        </Animated.View>

        {/* Feedback icon */}
        {isCorrect !== null && (
          <View className="absolute bottom-10 items-center">
            <Ionicons
              name={isCorrect ? "checkmark-circle" : "close-circle"}
              size={48}
              color={isCorrect ? "#10B981" : "#EF4444"}
            />
            <Text
              className={`text-lg font-bold mt-2 ${
                isCorrect ? "text-emerald-500" : "text-red-500"
              }`}
            >
              {isCorrect ? "Correct!" : "Try Again!"}
            </Text>
          </View>
        )}

        {/* Level up celebration */}
        {showCelebration && (
          <View className="absolute inset-0 justify-center items-center bg-white/90">
            <Text className="text-3xl font-bold text-amber-500 mb-2">
              Level Up!
            </Text>
            <Text className="text-lg text-slate-800 mb-4">
              You're now level {level}!
            </Text>
            <Ionicons name="trophy" size={48} color="#F59E0B" />
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}
