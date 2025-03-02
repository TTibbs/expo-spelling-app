import React, { useState, useEffect } from "react";
import { View, Text, Image, TouchableOpacity, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import Animated, { FlipInYRight } from "react-native-reanimated";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { wordsByCategory, xpValues, playerLevels } from "@/lib/data";
import { Word, LearnedWord, UserProfile } from "@/types/common";
import { Audio } from "expo-av";

// Generate alphabet buttons
const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

export default function WordDetailScreen(): JSX.Element {
  const { id, category } = useLocalSearchParams();
  const router = useRouter();

  // Find the word data
  const wordData: Word | undefined = wordsByCategory[
    category as keyof typeof wordsByCategory
  ]?.find((w) => w.id === id);

  const [guessedLetters, setGuessedLetters] = useState<string[]>([]);
  const [correctLetters, setCorrectLetters] = useState<string[]>([]);
  const [incorrectLetters, setIncorrectLetters] = useState<string[]>([]);
  const [gameWon, setGameWon] = useState<boolean>(false);
  const [wordAlreadyLearned, setWordAlreadyLearned] = useState<boolean>(false);
  const [soundEffect, setSoundEffect] = useState<Audio.Sound | null>(null);

  useEffect(() => {
    // Check if this word has already been learned
    checkIfWordLearned();
  }, []);

  async function playSound(type: "correct" | "incorrect" | "winner") {
    try {
      // Unload previous sound if exists
      if (soundEffect) {
        await soundEffect.unloadAsync();
      }

      // Select the appropriate sound file
      const soundFile =
        type === "correct"
          ? require("../../assets/sounds/correct.mp3")
          : type === "incorrect"
          ? require("../../assets/sounds/incorrect.mp3")
          : require("../../assets/sounds/winner.mp3");

      // Load and play the sound
      const { sound } = await Audio.Sound.createAsync(soundFile);
      setSoundEffect(sound);
      await sound.playAsync();
    } catch (error) {
      console.error("Failed to play sound:", error);
    }
  }

  useEffect(() => {
    return () => {
      if (soundEffect) {
        soundEffect.unloadAsync();
      }
    };
  }, [soundEffect]);

  const checkIfWordLearned = async (): Promise<void> => {
    try {
      const storedWords = await AsyncStorage.getItem("learnedWords");
      if (storedWords) {
        const learnedWords = JSON.parse(storedWords);
        const isLearned = learnedWords.some(
          (word: LearnedWord) => word.id === id && word.category === category
        );
        setWordAlreadyLearned(isLearned);
      }
    } catch (error) {
      console.error("Failed to check learned words:", error);
    }
  };

  // Update user XP
  const updateUserXp = async (xpToAdd: number): Promise<UserProfile | null> => {
    try {
      // Get current user profile
      const userProfileStr = await AsyncStorage.getItem("userProfile");
      let userProfile: UserProfile = userProfileStr
        ? JSON.parse(userProfileStr)
        : { xp: 0, level: "1", lastPlayed: null };

      // Add XP
      userProfile.xp += xpToAdd;
      userProfile.lastPlayed = new Date().toISOString();

      // Calculate level based on XP
      for (const level of playerLevels) {
        if (userProfile.xp >= level.minXp && userProfile.xp < level.maxXp) {
          userProfile.level = level.id;
          break;
        }
      }

      // Save updated profile
      await AsyncStorage.setItem("userProfile", JSON.stringify(userProfile));

      return userProfile;
    } catch (error) {
      console.error("Failed to update user XP:", error);
      return null;
    }
  };

  // Calculate XP earned for this word
  const calculateXpEarned = (): number => {
    if (!wordData) return 0;

    let xp = xpValues.completeWord; // Base XP for completing a word
    console.log(`Base XP: ${xp}`);

    // Bonus XP for perfect game (no incorrect letters)
    if (incorrectLetters.length === 0) {
      xp += xpValues.perfectWord;
      console.log(`Added perfect game bonus: +${xpValues.perfectWord}`);
    }

    // Bonus XP for longer words
    const wordLength = wordData.word.length;
    if (wordLength >= 10) {
      xp += xpValues.tenLetterWord;
      console.log(
        `Added bonus for 10+ letter word: +${xpValues.tenLetterWord}`
      );
    } else if (wordLength >= 5) {
      xp += xpValues.fiveLetterWord;
      console.log(
        `Added bonus for 5+ letter word: +${xpValues.fiveLetterWord}`
      );
    }

    console.log(`Total XP to award: ${xp}`);
    return xp;
  };

  // Save word to learned words and award XP
  const saveWordAndAwardXp = async (): Promise<number> => {
    if (!wordData) return 0;

    try {
      // Get current learned words
      const storedWords = await AsyncStorage.getItem("learnedWords");
      let learnedWords: LearnedWord[] = storedWords
        ? JSON.parse(storedWords)
        : [];

      // Check if word is already in the list
      const wordExists = learnedWords.some(
        (word: LearnedWord) => word.id === id && word.category === category
      );

      // If word already exists, no XP awarded
      if (wordExists) {
        console.log("Word already learned, no XP awarded");
        return 0;
      }

      // Calculate XP to award
      const xpToAward = calculateXpEarned();
      console.log(`Awarding ${xpToAward} XP for word: ${wordData.word}`);

      // Add the new word
      learnedWords.push({
        id: wordData.id,
        word: wordData.word,
        category: category as string,
        image: wordData.image,
        learnedAt: new Date().toISOString(),
      });

      // Save back to storage
      await AsyncStorage.setItem("learnedWords", JSON.stringify(learnedWords));

      // Update user XP
      await updateUserXp(xpToAward);

      setWordAlreadyLearned(true);
      return xpToAward;
    } catch (error) {
      console.error("Failed to save word or award XP:", error);
      return 0;
    }
  };

  // Reset the game
  const resetGame = (): void => {
    setGuessedLetters([]);
    setCorrectLetters([]);
    setIncorrectLetters([]);
    setGameWon(false);
  };

  // Handle letter press
  const handleLetterPress = async (letter: string): Promise<void> => {
    if (guessedLetters.includes(letter) || gameWon) return;

    const newGuessedLetters = [...guessedLetters, letter];
    setGuessedLetters(newGuessedLetters);

    if (wordData?.word.includes(letter)) {
      const newCorrectLetters = [...correctLetters, letter];
      setCorrectLetters(newCorrectLetters);
      playSound("correct");

      // Check if all letters have been guessed
      const uniqueLettersInWord = [...new Set(wordData.word.split(""))];
      const allLettersGuessed = uniqueLettersInWord.every((l) =>
        newCorrectLetters.includes(l)
      );

      if (allLettersGuessed) {
        try {
          // Save the word and award XP - wait for it to complete
          const earnedXpAmount = await saveWordAndAwardXp();
          console.log("XP earned:", earnedXpAmount); // Debug log

          // Set game won state after XP is calculated
          setGameWon(true);

          // Play winner sound
          playSound("winner");

          // Show the alert with XP information immediately
          const message = `You've spelled "${wordData.word}" correctly!`;

          // Create a more prominent XP message
          let xpMessage = "";
          if (earnedXpAmount > 0) {
            xpMessage = `\n\n✨ You earned ${earnedXpAmount} XP! ✨`;

            // Add bonus information if applicable
            if (incorrectLetters.length === 0) {
              xpMessage += "\n🌟 Perfect game bonus included! 🌟";
            }

            if (wordData.word.length >= 10) {
              xpMessage += "\n📏 10+ letter word bonus included!";
            } else if (wordData.word.length >= 5) {
              xpMessage += "\n📏 5+ letter word bonus included!";
            }
          } else if (wordAlreadyLearned) {
            xpMessage = "\n\nYou've already learned this word before.";
          }

          Alert.alert("Congratulations! 🎉", `${message}${xpMessage}`, [
            { text: "Play Again", onPress: resetGame },
            { text: "View Profile", onPress: () => router.push("/profile") },
            { text: "Choose Another Word", onPress: () => router.back() },
          ]);
        } catch (error) {
          console.error("Error handling game completion:", error);

          // Set game won state even if there's an error
          setGameWon(true);

          Alert.alert(
            "Congratulations! 🎉",
            `You've spelled "${wordData.word}" correctly!\n\nUnable to calculate XP at this time.`,
            [
              { text: "Play Again", onPress: resetGame },
              { text: "View Profile", onPress: () => router.push("/profile") },
              { text: "Choose Another Word", onPress: () => router.back() },
            ]
          );
        }
      }
    } else {
      setIncorrectLetters([...incorrectLetters, letter]);
      playSound("incorrect");
    }
  };

  // Render word with blanks and guessed letters
  const renderWord = (): JSX.Element | null => {
    if (!wordData) return null;

    return (
      <>
        {wordData.word.split("").map((letter, index) => {
          const isGuessed = correctLetters.includes(letter);
          return (
            <View
              key={index}
              className="mx-[5px] my-[5px] w-[30px] items-center"
            >
              {isGuessed ? (
                <Animated.Text
                  entering={FlipInYRight.delay(index * 100)}
                  className="text-2xl font-bold text-[#1E293B]"
                >
                  {letter}
                </Animated.Text>
              ) : (
                <Text className="text-2xl font-bold text-[#94A3B8]">_</Text>
              )}
            </View>
          );
        })}
      </>
    );
  };

  if (!wordData) {
    return (
      <SafeAreaView className="flex-1 bg-[#F9F9F9]">
        <Text>Word not found</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-[#F9F9F9]">
      <View className="flex-row justify-between items-center px-5 py-[15px]">
        <TouchableOpacity
          className="w-10 h-10 rounded-full bg-[#F1F5F9] justify-center items-center"
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="#1E293B" />
        </TouchableOpacity>
        <TouchableOpacity
          className="w-10 h-10 rounded-full bg-[#F1F5F9] justify-center items-center"
          onPress={resetGame}
        >
          <Ionicons name="refresh" size={20} color="#1E293B" />
        </TouchableOpacity>
      </View>

      <View className="w-full h-[200px] px-5 mb-2 relative">
        <Image
          source={{ uri: wordData.image }}
          className="w-full h-full rounded-2xl"
          resizeMode="cover"
        />
        {wordAlreadyLearned && !gameWon && (
          <View className="absolute top-[10px] right-[30px] bg-[rgba(99,102,241,0.9)] py-[5px] px-[10px] rounded-xl">
            <Text className="text-white font-bold text-xs">
              Already Learned
            </Text>
          </View>
        )}
      </View>

      <View className="flex-row justify-center items-center mb-6 flex-wrap px-5">
        {renderWord()}
      </View>

      <View className="px-4 pb-8 mt-auto">
        <View className="flex-row flex-wrap justify-center">
          {alphabet.map((letter) => {
            const isGuessed = guessedLetters.includes(letter);
            const isCorrect = correctLetters.includes(letter);

            // Determine background color based on state
            const getBgColor = () => {
              if (isGuessed && isCorrect) return "bg-green-500";
              if (isGuessed) return "bg-red-500";
              return "bg-white";
            };

            // Determine border based on state
            const getBorder = () => {
              if (isGuessed && isCorrect) return "border-2 border-green-500";
              if (isGuessed) return "border-2 border-red-500";
              return "border border-gray-200";
            };

            // Determine text color based on state
            const getTextColor = () => {
              if (isGuessed && isCorrect) return "text-white";
              if (isGuessed) return "text-white";
              return "text-[#1E293B]";
            };

            return (
              <TouchableOpacity
                key={letter}
                className={`w-[44px] h-[44px] rounded-2xl ${getBgColor()} ${getBorder()} justify-center items-center m-2 shadow-md`}
                onPress={() => handleLetterPress(letter)}
                disabled={isGuessed || gameWon}
              >
                <Text className={`text-2xl font-bold ${getTextColor()}`}>
                  {letter}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    </SafeAreaView>
  );
}
