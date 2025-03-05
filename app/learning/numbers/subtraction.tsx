import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, Animated } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Audio } from "expo-av";
import {
  SubtractionEquationProps,
  MathEquation,
  MathGameState,
} from "@/types/numbers";
import {
  getMathStats,
  saveMathStats,
  updateRewardProgress,
} from "@/lib/storage";
import { useChild } from "@/context/ChildContext";
import { formatPoints } from "@/lib/utils";

const Equation = ({
  num1,
  num2,
  answer,
  selectedAnswer,
  onSelect,
  options,
}: SubtractionEquationProps) => {
  return (
    <View className="bg-white rounded-2xl p-4 mb-4 shadow-sm">
      <View className="flex-row justify-center items-center mb-6">
        <Text className="text-4xl font-bold text-slate-800 mx-2">{num1}</Text>
        <View className="mx-2">
          <Ionicons name="remove" size={36} color="#F59E0B" />
        </View>
        <Text className="text-4xl font-bold text-slate-800 mx-2">{num2}</Text>
        <Text className="text-4xl font-bold text-slate-800 mx-2">=</Text>
        <Text className="text-4xl font-bold text-slate-800 mx-2">?</Text>
      </View>

      <View className="flex-row justify-center items-center mb-6 flex-wrap">
        <View className="flex-row flex-wrap justify-center w-25 mx-1">
          {[...Array(num1)].map((_, i) => (
            <View
              key={`num1-${i}`}
              className={`w-4 h-4 rounded-full m-1 ${
                i >= num1 - num2 ? "bg-slate-300 opacity-50" : "bg-amber-500"
              }`}
            />
          ))}
        </View>

        <View className="mx-1">
          <Ionicons name="remove" size={24} color="#F59E0B" />
        </View>

        <View className="flex-row flex-wrap justify-center w-25 mx-1">
          {[...Array(num2)].map((_, i) => (
            <View
              key={`num2-${i}`}
              className="w-4 h-4 rounded-full bg-slate-300 opacity-50 m-1"
            />
          ))}
        </View>

        <View className="mx-1">
          <Text className="text-2xl font-bold text-slate-800">=</Text>
        </View>

        <View className="flex-row flex-wrap justify-center w-25 mx-1">
          {[...Array(answer)].map((_, i) => (
            <View
              key={`result-${i}`}
              className="w-4 h-4 rounded-full bg-amber-500 m-1"
            />
          ))}
        </View>
      </View>

      <View className="flex-row justify-around">
        {options.map((option: number, index: number) => (
          <TouchableOpacity
            key={index}
            className={`bg-white border-2 border-amber-500 rounded-xl py-3 px-6 min-w-[80px] items-center ${
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
                selectedAnswer === option
                  ? option === answer
                    ? "text-emerald-500"
                    : "text-red-500"
                  : "text-slate-800"
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

export default function SubtractionScreen() {
  const { activeChild } = useChild();
  const [gameState, setGameState] = useState<MathGameState>({
    currentProblem: null,
    score: 0,
    streak: 0,
    level: 1,
    problemsCompleted: 0,
    showCelebration: false,
    showHint: false,
    showExplanation: false,
    isPaused: false,
    gameMode: "practice",
    difficulty: "easy",
  });
  const [currentEquation, setCurrentEquation] = useState<MathEquation>({
    num1: 5,
    num2: 2,
    answer: 3,
    operator: "-",
    difficulty: "easy",
  });
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [answerOptions, setAnswerOptions] = useState<number[]>([]);
  const scaleAnim = useState(new Animated.Value(1))[0];
  const [soundEffect, setSoundEffect] = useState<Audio.Sound | null>(null);

  useEffect(() => {
    generateNewEquation();
  }, [gameState.level]);

  const generateNewEquation = () => {
    // Difficulty increases with level
    const maxNum = Math.min(5 + gameState.level, 20);

    // For subtraction, we need num1 >= num2
    const num1 = Math.floor(Math.random() * maxNum) + 2; // ensure at least 2
    const num2 = Math.floor(Math.random() * num1); // ensure num2 <= num1
    const answer = num1 - num2;

    setCurrentEquation({
      num1,
      num2,
      answer,
      operator: "-",
      difficulty: "easy",
    });
    setSelectedAnswer(null);
    setIsCorrect(null);

    // Generate and store answer options
    const options = [answer, answer + 1, answer - 1].sort(
      () => Math.random() - 0.5
    );
    setAnswerOptions(options);
  };

  // Play sound effect
  const playSound = async (type: "correct" | "incorrect") => {
    try {
      if (soundEffect) {
        await soundEffect.unloadAsync();
      }

      const soundFile =
        type === "correct"
          ? require("../../../assets/sounds/correct.mp3")
          : require("../../../assets/sounds/incorrect.mp3");

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
    const correct = answer === currentEquation.answer;
    setIsCorrect(correct);

    if (correct) {
      playSound("correct");
      setGameState((prev) => ({
        ...prev,
        score: prev.score + 10,
        streak: prev.streak + 1,
        problemsCompleted: prev.problemsCompleted + 1,
      }));

      // Update reward progress
      await updateRewardProgress("math_problems", 1, activeChild?.id);

      // Scale animation for correct answer
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

      // Level up logic
      if (gameState.streak > 0 && gameState.streak % 5 === 0) {
        setGameState((prev) => ({
          ...prev,
          level: Math.min(prev.level + 1, 10),
          showCelebration: true,
        }));
        setTimeout(() => {
          setGameState((prev) => ({ ...prev, showCelebration: false }));
        }, 3000);
      }

      // Update math statistics
      try {
        const mathStats = await getMathStats(activeChild?.id);

        // Update subtraction stats
        mathStats.totalProblems += 1;
        mathStats.correctAnswers += 1;
        mathStats.subtraction.attempted += 1;
        mathStats.subtraction.correct += 1;

        // Calculate new accuracy
        const subtractionAccuracy = Math.round(
          (mathStats.subtraction.correct / mathStats.subtraction.attempted) *
            100
        );
        mathStats.subtraction.accuracy = subtractionAccuracy;

        // Update streak
        if (gameState.streak + 1 > mathStats.highestStreak) {
          mathStats.highestStreak = gameState.streak + 1;
        }
        mathStats.streak = gameState.streak;

        // Save updated math stats
        await saveMathStats(mathStats, activeChild?.id);
      } catch (error) {
        console.error(
          "Failed to update stats:",
          error instanceof Error ? error.message : "Unknown error"
        );
      }
    } else {
      playSound("incorrect");
      setGameState((prev) => ({ ...prev, streak: 0 }));

      // Update math statistics for incorrect answer
      try {
        const mathStats = await getMathStats(activeChild?.id);

        mathStats.totalProblems += 1;
        mathStats.subtraction.attempted += 1;
        // Don't increment correct answers or correct count

        // Calculate new accuracy
        const newAccuracy = Math.round(
          (mathStats.subtraction.correct / mathStats.subtraction.attempted) *
            100
        );
        mathStats.subtraction.accuracy = newAccuracy;
        mathStats.streak = 0; // Reset streak on incorrect answer

        // Save updated math stats
        await saveMathStats(mathStats, activeChild?.id);
      } catch (error) {
        console.error(
          "Failed to update stats:",
          error instanceof Error ? error.message : "Unknown error"
        );
      }
    }

    // Show answer briefly before generating a new equation
    setTimeout(() => {
      generateNewEquation();
      setSelectedAnswer(null);
      setIsCorrect(null);
    }, 1500);
  };

  return (
    <SafeAreaView className="flex-1 bg-amber-50">
      {/* Progress bar */}
      <View className="flex-row justify-between items-center p-4 bg-white border-b border-slate-200">
        <View className="flex-row items-center">
          <Ionicons name="star" size={20} color="#F59E0B" />
          <Text className="text-base font-bold text-slate-800 ml-1">
            {formatPoints(gameState.score)} points
          </Text>
        </View>
        <View className="bg-amber-500 px-3 py-1 rounded-full">
          <Text className="text-white font-bold">Level {gameState.level}</Text>
        </View>
        <View className="flex-row items-center">
          <Ionicons name="flame" size={20} color="#EF4444" />
          <Text className="text-base font-bold text-slate-800 ml-1">
            {gameState.streak}
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
            options={answerOptions}
          />
        </Animated.View>

        {/* Instructions for kids */}
        <View className="bg-white p-4 rounded-xl my-4 w-full">
          <Text className="text-lg font-bold text-slate-800 mb-2">
            How to Subtract:
          </Text>
          <Text className="text-sm text-slate-500 leading-5">
            Start with the top number, then take away (subtract) the bottom
            number!
          </Text>
        </View>

        {/* Feedback icon */}
        {isCorrect !== null && (
          <View className="absolute bottom-10 left-0 right-0 items-center">
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
              {isCorrect ? "Great job!" : "Let's try again!"}
            </Text>
          </View>
        )}

        {/* Level up celebration */}
        {gameState.showCelebration && (
          <View className="absolute inset-0 justify-center items-center bg-white/90">
            <Text className="text-3xl font-bold text-amber-500 mb-2">
              Level Up!
            </Text>
            <Text className="text-lg text-slate-800 mb-4">
              You're now level {gameState.level}!
            </Text>
            <Ionicons name="trophy" size={48} color="#F59E0B" />
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}
