import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, Animated, FlatList } from "react-native";
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
      className={`w-[18%] aspect-square m-[1%] bg-white justify-center items-center rounded-xl border-2 ${
        selected
          ? correct === true
            ? "bg-emerald-500 border-emerald-500"
            : "bg-red-500 border-red-500"
          : "border-emerald-500"
      }`}
      onPress={() => onPress(number)}
      disabled={selected}
    >
      <Text
        className={`text-2xl font-bold ${
          selected ? "text-white" : "text-slate-800"
        }`}
      >
        {number}
      </Text>
    </TouchableOpacity>
  );
};

// Number visuals - displays objects to count
const NumberVisual = ({ count, icon, color }: NumberVisualProps) => {
  return (
    <View className="flex-row flex-wrap justify-center p-4 bg-white rounded-2xl max-w-[90%] mx-[5%] shadow-sm">
      {[...Array(count)].map((_, index) => (
        <View key={index} className="m-1.5">
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
    <SafeAreaView className="flex-1 bg-emerald-50">
      {/* Header with score */}
      <View className="flex-row justify-between items-center p-4 bg-white border-b border-slate-200">
        <View className="flex-row items-center">
          <Ionicons name="star" size={20} color="#F59E0B" />
          <Text className="text-base font-bold text-slate-800 ml-1">
            {score} points
          </Text>
        </View>

        <View className="flex-row items-center bg-red-50 px-3 py-1 rounded-full">
          <Ionicons name="flame" size={20} color="#EF4444" />
          <Text className="text-sm font-bold text-red-500 ml-1">{streak}</Text>
        </View>
      </View>

      {/* Question - "Count the items" */}
      <View className="items-center my-4">
        <Text className="text-2xl font-bold text-slate-800">
          How many items do you see?
        </Text>
        <Text className="text-base text-slate-500 mt-2">Count them!</Text>
      </View>

      {/* Visual representation - items to count */}
      <Animated.View
        className="items-center my-4"
        style={{ transform: [{ scale: scaleAnim }] }}
      >
        <NumberVisual
          count={currentNumber}
          icon={currentTheme.icon}
          color={currentTheme.color}
        />
      </Animated.View>

      {/* Number selection */}
      <View className="flex-1 mt-4 px-4">
        <Text className="text-lg font-bold text-slate-800 mb-3">
          Pick the correct number:
        </Text>

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
          contentContainerStyle={{ paddingBottom: 32 }}
        />
      </View>

      {/* Feedback message */}
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
            {isCorrect
              ? "Great counting!"
              : `That's ${selectedNumber}. Let's try again!`}
          </Text>
        </View>
      )}

      {/* Celebration overlay */}
      {showCelebration && (
        <View className="absolute inset-0 justify-center items-center bg-white/90 z-10">
          <Text className="text-3xl font-bold text-amber-500 mb-2">
            Amazing!
          </Text>
          <Text className="text-lg text-slate-800 mb-4">
            You got {streak} correct in a row!
          </Text>
          <Ionicons name="trophy" size={64} color="#F59E0B" />
        </View>
      )}
    </SafeAreaView>
  );
}
