import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Alert,
  Animated,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import ReAnimated, { FlipInYRight } from "react-native-reanimated";
import { wordsByCategory, xpValues } from "@/lib/data";
import { Word } from "@/types/common";
import {
  WordGameState,
  LetterTile,
  LetterButtonStyleState,
  WordImageProps,
} from "@/types/spelling";
import { AppImageSource } from "@/types/styling";
import { RouteParams } from "@/types/navigation";
import { Audio } from "expo-av";
import { isWordLearned, saveLearnedWord, updateUserXp } from "@/lib/storage";
import { withErrorBoundary } from "@/components/ErrorBoundary";
import { wordSounds } from "@/lib/data";

// Generate alphabet buttons
const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

// Create a custom error fallback for word details
const WordDetailErrorFallback = ({
  resetError,
  goToHome,
}: {
  resetError: () => void;
  goToHome: () => void;
}): JSX.Element => (
  <SafeAreaView className="flex-1 bg-[#F9F9F9]">
    <View className="flex-1 justify-center items-center p-5">
      <Image
        // source={require("../../assets/images/error-illustration.png")}
        style={{ width: 200, height: 200, marginBottom: 20 }}
      />
      <Text className="text-xl font-bold text-center mb-2">
        Oops! We couldn't load this word
      </Text>
      <Text className="text-base text-gray-600 text-center mb-6">
        Something went wrong while trying to load this activity.
      </Text>

      <View className="flex-row">
        <TouchableOpacity
          className="bg-purple-500 rounded-lg py-3 px-5 mr-3"
          onPress={resetError}
        >
          <Text className="text-white font-bold">Try Again</Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="bg-blue-500 rounded-lg py-3 px-5"
          onPress={goToHome}
        >
          <Text className="text-white font-bold">Choose Another Word</Text>
        </TouchableOpacity>
      </View>
    </View>
  </SafeAreaView>
);

// Define the main component without default export
function WordDetailScreen(): JSX.Element {
  // Type-safe route parameters
  const params = useLocalSearchParams<RouteParams["/word/[id]"]>();
  const router = useRouter();

  // Ensure params have the correct type
  const id = params.id ?? "";
  const category = params.category ?? "";

  // Initialize animation values
  const [fadeAnim] = useState<Animated.Value>(new Animated.Value(0));
  const [scaleAnim] = useState<Animated.Value>(new Animated.Value(1));
  const [pronounceAnim] = useState<Animated.Value>(new Animated.Value(1));
  const [isPronouncing, setIsPronouncing] = useState<boolean>(false);

  // Find the word data
  const wordData: Word | undefined = wordsByCategory[
    category as keyof typeof wordsByCategory
  ]?.find((w) => w.id === id);

  // Initial game state
  const [gameState, setGameState] = useState<WordGameState>({
    wordId: id as string,
    category: category as string,
    status: "initial",
    guessedLetters: [],
    correctLetters: [],
    incorrectLetters: [],
    attempts: 0,
    gameWon: false,
    wordAlreadyLearned: false,
    xpEarned: 0,
    timeSpent: 0,
    hintsUsed: 0,
    difficulty: "easy",
    mode: "practice",
    animations: {
      main: {
        letterEntrance: { isActive: false, delay: 100 },
        wordReveal: { isActive: false, duration: 500 },
        winAnimation: { isActive: false },
        value: null,
      },
      letterFlip: {
        letterEntrance: { isActive: false, delay: 100 },
        wordReveal: { isActive: false, duration: 500 },
        winAnimation: { isActive: false },
        value: null,
      },
      successAnimation: {
        letterEntrance: { isActive: false, delay: 100 },
        wordReveal: { isActive: false, duration: 500 },
        winAnimation: { isActive: false },
        value: null,
      },
      hintAnimation: {
        letterEntrance: { isActive: false, delay: 100 },
        wordReveal: { isActive: false, duration: 500 },
        winAnimation: { isActive: false },
        value: null,
      },
    },
    sounds: {
      correct: { sound: null, isLoaded: false, isPlaying: false },
      incorrect: { sound: null, isLoaded: false, isPlaying: false },
      winner: { sound: null, isLoaded: false, isPlaying: false },
    },
    hints: {
      available: 3,
      used: 0,
      lastUsed: null,
    },
    scoring: {
      basePoints: 0,
      timeBonus: 0,
      streakBonus: 0,
      hintPenalty: 0,
      totalPoints: 0,
    },
  });

  // Backward compatibility with existing code
  const {
    guessedLetters,
    correctLetters,
    incorrectLetters,
    gameWon,
    wordAlreadyLearned,
  } = gameState;
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

      // Create and play the sound
      const { sound } = await Audio.Sound.createAsync(soundFile);
      setSoundEffect(sound);
      await sound.playAsync();

      // Update state
      setGameState((prev) => ({
        ...prev,
        sounds: {
          ...prev.sounds,
          [type]: {
            sound,
            isLoaded: true,
            isPlaying: true,
          },
        },
      }));
    } catch (error) {
      console.error("Error playing sound", error);
    }
  }

  // Use our type-safe storage utility to check if word is learned
  const checkIfWordLearned = async (): Promise<void> => {
    try {
      const alreadyLearned = await isWordLearned(id, category);

      setGameState((prev) => ({
        ...prev,
        wordAlreadyLearned: alreadyLearned,
        status: alreadyLearned ? "completed" : "initial",
      }));
    } catch (error) {
      console.error("Error checking if word is learned:", error);
    }
  };

  // Calculate XP earned for this word
  const calculateXpEarned = (): number => {
    if (!wordData) return 0;

    let xp = xpValues.completeWord; // Base XP for completing a word

    // Bonus XP for perfect game (no incorrect letters)
    if (incorrectLetters.length === 0) {
      xp += xpValues.perfectWord;
    }

    // Bonus XP for longer words
    const wordLength = wordData.word.length;
    if (wordLength >= 10) {
      xp += xpValues.tenLetterWord;
    } else if (wordLength >= 5) {
      xp += xpValues.fiveLetterWord;
    }

    // Apply hint penalties
    const hintPenalty = gameState.hintsUsed * xpValues.hintPenalty; // Use the value from xpValues
    xp = Math.max(0, xp - hintPenalty); // Ensure XP doesn't go below 0

    return xp;
  };

  // Save word to learned words and award XP using type-safe storage
  const saveWordAndAwardXp = async (): Promise<number> => {
    if (!wordData) return 0;

    try {
      // Check if word is already learned with our utility function
      const alreadyLearned = await isWordLearned(id, category);

      // If word already exists, no XP awarded
      if (alreadyLearned) {
        console.log("Word already learned, no XP awarded");
        return 0;
      }

      // Calculate XP to award
      const xpToAward = calculateXpEarned();

      // Save the learned word
      const savedWord = await saveLearnedWord(wordData, category);

      if (!savedWord) {
        console.error("Failed to save learned word");
        return 0;
      }

      // Update user XP
      await updateUserXp(xpToAward);

      setGameState((prev) => ({
        ...prev,
        wordAlreadyLearned: true,
        status: "completed",
        xpEarned: xpToAward,
      }));

      return xpToAward;
    } catch (error) {
      console.error("Failed to save word or award XP:", error);
      return 0;
    }
  };

  // Reset the game
  const resetGame = (): void => {
    setGameState((prev) => ({
      ...prev,
      guessedLetters: [],
      correctLetters: [],
      incorrectLetters: [],
      gameWon: false,
      status: "initial",
      attempts: 0,
      xpEarned: 0,
    }));
  };

  // Handle letter press
  const handleLetterPress = async (letter: string): Promise<void> => {
    if (gameState.guessedLetters.includes(letter) || gameState.gameWon) return;

    const newGuessedLetters = [...gameState.guessedLetters, letter];

    setGameState((prev) => ({
      ...prev,
      guessedLetters: newGuessedLetters,
      status: "in-progress",
      attempts: prev.attempts + 1,
    }));

    if (wordData?.word.includes(letter)) {
      const newCorrectLetters = [...gameState.correctLetters, letter];

      setGameState((prev) => ({
        ...prev,
        correctLetters: newCorrectLetters,
      }));

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
          setGameState((prev) => ({
            ...prev,
            gameWon: true,
            status: "won",
            xpEarned: earnedXpAmount,
          }));

          // Play winner sound
          playSound("winner");

          // Show the alert with XP information immediately
          const message = `You've spelled "${wordData.word}" correctly!`;

          // Create a more prominent XP message
          let xpMessage = "";
          if (earnedXpAmount > 0) {
            xpMessage = `\n\n✨ You earned ${earnedXpAmount} XP! ✨`;

            // Add bonus information if applicable
            if (!gameState.wordAlreadyLearned) {
              xpMessage += `\n(First time bonus: +${xpValues.completeWord} XP)`;
            }
          } else {
            xpMessage = "\n\nYou've already earned XP for this word.";
          }

          // Show the success alert after a delay
          setTimeout(() => {
            Alert.alert("Well Done!", message + xpMessage, [
              { text: "View Profile", onPress: () => router.push("/profile") },
              { text: "Choose Another Word", onPress: () => router.back() },
            ]);
          }, 200);
        } catch (error) {
          console.error("Error processing word completion:", error);
          Alert.alert("Error", "There was a problem saving your progress.");
        }
      }
    } else {
      setGameState((prev) => ({
        ...prev,
        incorrectLetters: [...prev.incorrectLetters, letter],
      }));

      playSound("incorrect");
    }
  };

  // Create a type-safe animation triggering function
  const triggerAnimation = (
    animValue: Animated.Value,
    config: { toValue: number; duration: number; delay?: number }
  ): void => {
    Animated.timing(animValue, {
      toValue: config.toValue,
      duration: config.duration,
      delay: config.delay || 0,
      useNativeDriver: true,
    }).start();
  };

  // When the game is won, trigger animations
  useEffect(() => {
    if (gameState.gameWon) {
      triggerAnimation(fadeAnim, { toValue: 1, duration: 500 });
      triggerAnimation(scaleAnim, { toValue: 1.2, duration: 300, delay: 200 });
    }
  }, [gameState.gameWon]);

  // Render word with blanks and guessed letters
  const renderWord = (): JSX.Element | null => {
    if (!wordData) return null;

    // Create letter tiles array for better typing
    const letterTiles: LetterTile[] = wordData.word
      .split("")
      .map((letter, index) => {
        const isGuessed = gameState.correctLetters.includes(letter);
        return {
          id: `${index}-${letter}`,
          letter,
          selected: isGuessed,
          position: index,
          status: isGuessed ? "correct" : "unused",
          animation: {
            letterEntrance: { isActive: isGuessed, delay: index * 100 },
            wordReveal: { isActive: false, duration: 0 },
            winAnimation: { isActive: false },
            value: null,
            type: "flip",
            timing: { duration: 300, delay: index * 100 },
          },
        };
      });

    return (
      <>
        {letterTiles.map((tile) => (
          <View
            key={tile.id}
            className="mx-[5px] my-[5px] w-[30px] items-center"
          >
            {tile.selected ? (
              <ReAnimated.Text
                entering={FlipInYRight.delay(tile.position * 100)}
                className="text-2xl font-bold text-[#1E293B]"
              >
                {tile.letter}
              </ReAnimated.Text>
            ) : (
              <Text className="text-2xl font-bold text-[#94A3B8]">_</Text>
            )}
          </View>
        ))}
      </>
    );
  };

  // Render word image with proper typing
  const renderWordImage = ({
    imageUri,
    isLearned,
    isGameWon,
  }: WordImageProps): JSX.Element => {
    return (
      <View className="w-full h-[200px] px-5 mb-2 relative">
        <Image
          source={{ uri: imageUri } as AppImageSource}
          className="w-full h-full rounded-2xl"
          resizeMode="cover"
        />
        {isLearned && !isGameWon && (
          <View className="absolute top-[10px] right-[30px] bg-[rgba(99,102,241,0.9)] py-[5px] px-[10px] rounded-xl">
            <Text className="text-white font-bold text-xs">
              Already Learned
            </Text>
          </View>
        )}
      </View>
    );
  };

  // Define a function to pronounce the word
  const pronounceWord = async (): Promise<void> => {
    try {
      if (isPronouncing) return;

      setIsPronouncing(true);

      // Get the appropriate sound URL for the current word
      const getSoundUrl = (wordId: string): string => {
        // First check if we have a specific sound for this word
        if (wordSounds[wordId]) {
          return wordSounds[wordId];
        }

        // If no specific sound, return the default sound
        return wordSounds.default;
      };

      const soundUrl = getSoundUrl(id);

      try {
        // Log which sound is being played (helpful for debugging)
        console.log(`Playing sound for word: ${id} - URL: ${soundUrl}`);

        const { sound } = await Audio.Sound.createAsync({
          uri: soundUrl,
        });

        await sound.playAsync();

        // Unload sound when finished
        sound.setOnPlaybackStatusUpdate((status) => {
          if (status.isLoaded && status.didJustFinish) {
            sound.unloadAsync();
          }
        });
      } catch (soundError) {
        console.error("Error playing sound from URL:", soundError);
        // Fallback to winner sound if URL fails
        await playSound("winner");
      }

      // Create a pulse animation for the pronunciation button
      Animated.sequence([
        Animated.timing(pronounceAnim, {
          toValue: 1.2,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(pronounceAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(pronounceAnim, {
          toValue: 1.2,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(pronounceAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setIsPronouncing(false);
      });

      // Add visual feedback for the word
      triggerAnimation(scaleAnim, {
        toValue: 1.05,
        duration: 300,
      });

      setTimeout(() => {
        triggerAnimation(scaleAnim, {
          toValue: 1,
          duration: 300,
        });
      }, 300);
    } catch (error) {
      setIsPronouncing(false);
      console.error("Error pronouncing word:", error);
      Alert.alert(
        "Pronunciation Error",
        "Could not play the word pronunciation."
      );
    }
  };

  // Handle hint
  const handleHint = (): void => {
    if (gameState.hints.available > 0 && wordData) {
      // Get all unguessed letters in the word
      const unguessedLetters = wordData.word
        .split("")
        .filter((letter) => !gameState.correctLetters.includes(letter));

      if (unguessedLetters.length > 0) {
        // Pick a random unguessed letter
        const randomIndex = Math.floor(Math.random() * unguessedLetters.length);
        const hintedLetter = unguessedLetters[randomIndex];

        // Update game state with the hinted letter
        setGameState((prev) => ({
          ...prev,
          hintsUsed: prev.hintsUsed + 1,
          hints: {
            ...prev.hints,
            available: prev.hints.available - 1,
            used: prev.hints.used + 1,
            lastUsed: new Date().toISOString(),
          },
          correctLetters: [...prev.correctLetters, hintedLetter],
          scoring: {
            ...prev.scoring,
            hintPenalty: prev.scoring.hintPenalty + xpValues.hintPenalty,
            totalPoints: prev.scoring.totalPoints - xpValues.hintPenalty,
          },
        }));

        // Play hint sound
        playSound("correct");

        // Check if all letters have been revealed
        const allLettersRevealed = wordData.word
          .split("")
          .every((letter) =>
            [...gameState.correctLetters, hintedLetter].includes(letter)
          );

        if (allLettersRevealed) {
          // End the game if all letters are revealed
          saveWordAndAwardXp().then((earnedXpAmount) => {
            setGameState((prev) => ({
              ...prev,
              gameWon: true,
              status: "won",
              xpEarned: earnedXpAmount,
            }));
            playSound("winner");

            // Show the alert with XP information
            const message = `You've spelled "${wordData.word}" correctly!`;
            let xpMessage = "";
            if (earnedXpAmount > 0) {
              xpMessage = `\n\n✨ You earned ${earnedXpAmount} XP! ✨`;
              if (!gameState.wordAlreadyLearned) {
                xpMessage += `\n(First time bonus: +${xpValues.completeWord} XP)`;
              }
            } else {
              xpMessage = "\n\nYou've already earned XP for this word.";
            }

            setTimeout(() => {
              Alert.alert("Well Done!", message + xpMessage, [
                {
                  text: "View Profile",
                  onPress: () => router.push("/profile"),
                },
                { text: "Choose Another Word", onPress: () => router.back() },
              ]);
            }, 200);
          });
        }
      }
    }
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
        <View className="flex-row">
          <TouchableOpacity
            className={`w-10 h-10 rounded-full ${
              gameState.hints.available > 0 ? "bg-blue-500" : "bg-slate-300"
            } justify-center items-center mr-2`}
            onPress={handleHint}
            disabled={gameState.hints.available === 0 || gameWon}
          >
            <Ionicons
              name="bulb"
              size={20}
              color={gameState.hints.available > 0 ? "white" : "#94A3B8"}
            />
            {gameState.hints.available > 0 && (
              <View className="absolute -top-1 -right-1 bg-red-500 rounded-full w-5 h-5 justify-center items-center">
                <Text className="text-white text-xs font-bold">
                  {gameState.hints.available}
                </Text>
              </View>
            )}
          </TouchableOpacity>
          <Animated.View
            style={{
              transform: [{ scale: pronounceAnim }],
              marginRight: 8,
            }}
          >
            <TouchableOpacity
              className={`w-10 h-10 rounded-full ${
                isPronouncing ? "bg-[#6366F1]" : "bg-[#F1F5F9]"
              } justify-center items-center`}
              onPress={pronounceWord}
              disabled={isPronouncing}
            >
              <Ionicons
                name="volume-high"
                size={20}
                color={isPronouncing ? "#FFFFFF" : "#1E293B"}
              />
            </TouchableOpacity>
          </Animated.View>
          <TouchableOpacity
            className="w-10 h-10 rounded-full bg-[#F1F5F9] justify-center items-center"
            onPress={resetGame}
          >
            <Ionicons name="refresh" size={20} color="#1E293B" />
          </TouchableOpacity>
        </View>
      </View>

      {renderWordImage({
        imageUri: wordData.image,
        isLearned: wordAlreadyLearned,
        isGameWon: gameWon,
      })}

      <View className="flex-row justify-center items-center mb-6 flex-wrap px-5">
        {renderWord()}
      </View>

      <View className="px-4 pb-8 mt-auto">
        <View className="flex-row flex-wrap justify-center">
          {alphabet.map((letter) => {
            const isGuessed = guessedLetters.includes(letter);
            const isCorrect = correctLetters.includes(letter);

            // Determine button style based on state with proper typing
            const getButtonStyle = (): LetterButtonStyleState => {
              if (isGuessed && isCorrect) {
                return {
                  backgroundColor: "bg-green-500",
                  borderStyle: "border-2 border-green-500",
                  textColor: "text-white",
                };
              }
              if (isGuessed) {
                return {
                  backgroundColor: "bg-red-500",
                  borderStyle: "border-2 border-red-500",
                  textColor: "text-white",
                };
              }
              // If the letter is correct but not guessed (revealed by hint)
              if (isCorrect) {
                return {
                  backgroundColor: "bg-green-500",
                  borderStyle: "border-2 border-green-500",
                  textColor: "text-white",
                };
              }
              return {
                backgroundColor: "bg-white",
                borderStyle: "border border-gray-200",
                textColor: "text-[#1E293B]",
              };
            };

            const buttonStyle = getButtonStyle();

            return (
              <TouchableOpacity
                key={letter}
                className={`w-[44px] h-[44px] rounded-2xl ${buttonStyle.backgroundColor} ${buttonStyle.borderStyle} justify-center items-center m-2 shadow-md`}
                onPress={() => handleLetterPress(letter)}
                disabled={isGuessed || gameWon}
              >
                <Text className={`text-2xl font-bold ${buttonStyle.textColor}`}>
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

// Export the component wrapped in an error boundary
export default withErrorBoundary(WordDetailScreen, {
  onError: (error, errorInfo) => {
    // Here you could log errors to a service in production
    console.error("Word Detail Screen Error:", error);
    console.error("Component Stack:", errorInfo.componentStack);
  },
  fallback: (
    <WordDetailErrorFallback resetError={() => {}} goToHome={() => {}} />
  ),
});
