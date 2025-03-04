import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Alert,
  Animated,
  Platform,
  Modal,
  ScrollView,
  Switch,
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
import { updateUserXP, isWordLearned, saveLearnedWord } from "@/lib/storage";
import { withErrorBoundary } from "@/components/ErrorBoundary";
import { wordSounds } from "@/lib/data";
import { useChild } from "@/context/ChildContext";
import * as Speech from "expo-speech";
import * as Haptics from "expo-haptics";

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

// Add TTSSettingsModal component above WordDetailScreen
interface TTSSettingsModalProps {
  isVisible: boolean;
  onClose: () => void;
  availableVoices: Speech.Voice[];
  selectedVoice: Speech.Voice | null;
  onVoiceSelect: (voice: Speech.Voice) => void;
  rate: number;
  onRateChange: (rate: number) => void;
  pitch: number;
  onPitchChange: (pitch: number) => void;
}

const TTSSettingsModal = ({
  isVisible,
  onClose,
  availableVoices,
  selectedVoice,
  onVoiceSelect,
  rate,
  onRateChange,
  pitch,
  onPitchChange,
}: TTSSettingsModalProps): JSX.Element => (
  <Modal
    animationType="slide"
    transparent={true}
    visible={isVisible}
    onRequestClose={onClose}
  >
    <View className="flex-1 justify-end bg-black/50">
      <View className="bg-white rounded-t-3xl p-6 h-3/4">
        <View className="flex-row justify-between items-center mb-6">
          <Text className="text-xl font-bold">Voice Settings</Text>
          <TouchableOpacity onPress={onClose}>
            <Ionicons name="close" size={24} color="#000" />
          </TouchableOpacity>
        </View>

        <ScrollView className="flex-1">
          {/* Rate Slider */}
          <View className="mb-6">
            <Text className="text-lg font-semibold mb-2">Speech Rate</Text>
            <View className="flex-row items-center justify-between">
              <TouchableOpacity
                onPress={() => onRateChange(Math.max(0.1, rate - 0.1))}
                className="bg-gray-200 p-2 rounded-full"
              >
                <Ionicons name="remove" size={20} color="#000" />
              </TouchableOpacity>
              <Text className="text-base">{rate.toFixed(1)}x</Text>
              <TouchableOpacity
                onPress={() => onRateChange(Math.min(2.0, rate + 0.1))}
                className="bg-gray-200 p-2 rounded-full"
              >
                <Ionicons name="add" size={20} color="#000" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Pitch Slider */}
          <View className="mb-6">
            <Text className="text-lg font-semibold mb-2">Pitch</Text>
            <View className="flex-row items-center justify-between">
              <TouchableOpacity
                onPress={() => onPitchChange(Math.max(0.5, pitch - 0.1))}
                className="bg-gray-200 p-2 rounded-full"
              >
                <Ionicons name="remove" size={20} color="#000" />
              </TouchableOpacity>
              <Text className="text-base">{pitch.toFixed(1)}</Text>
              <TouchableOpacity
                onPress={() => onPitchChange(Math.min(2.0, pitch + 0.1))}
                className="bg-gray-200 p-2 rounded-full"
              >
                <Ionicons name="add" size={20} color="#000" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Voice Selection */}
          <Text className="text-lg font-semibold mb-2">Available Voices</Text>
          {availableVoices
            .filter((voice) => voice.language.startsWith("en"))
            .map((voice) => (
              <TouchableOpacity
                key={voice.identifier}
                onPress={() => onVoiceSelect(voice)}
                className={`p-4 rounded-lg mb-2 border ${
                  selectedVoice?.identifier === voice.identifier
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200"
                }`}
              >
                <Text className="font-semibold">
                  {voice.name} ({voice.language})
                </Text>
                <Text className="text-sm text-gray-600">
                  Quality: {voice.quality}
                </Text>
              </TouchableOpacity>
            ))}
        </ScrollView>

        <TouchableOpacity
          onPress={onClose}
          className="bg-blue-500 py-3 px-6 rounded-lg mt-4"
        >
          <Text className="text-white text-center font-bold">Done</Text>
        </TouchableOpacity>
      </View>
    </View>
  </Modal>
);

// Define the main component without default export
function WordDetailScreen(): JSX.Element {
  const { activeChild } = useChild();
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

  // Add state for voice selection at the top with other state declarations
  const [availableVoices, setAvailableVoices] = useState<Speech.Voice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<Speech.Voice | null>(null);

  // Add new state for TTS settings
  const [showTTSSettings, setShowTTSSettings] = useState<boolean>(false);
  const [speechRate, setSpeechRate] = useState<number>(0.75);
  const [speechPitch, setSpeechPitch] = useState<number>(1.0);

  // Add new state for syllable pronunciation
  const [isSpeakingSyllable, setIsSpeakingSyllable] = useState<boolean>(false);
  const [syllableAnim] = useState<Animated.Value>(new Animated.Value(1));

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

  // Add useEffect to load available voices
  useEffect(() => {
    async function loadVoices() {
      try {
        const voices = await Speech.getAvailableVoicesAsync();
        setAvailableVoices(voices);

        // Select the best quality British English voice if available
        const bestVoice =
          voices.find(
            (voice) =>
              voice.language === "en-GB" &&
              voice.quality === Speech.VoiceQuality.Enhanced
          ) || voices.find((voice) => voice.language === "en-GB");

        if (bestVoice) {
          setSelectedVoice(bestVoice);
        }
      } catch (error) {
        console.error("Error loading voices:", error);
      }
    }

    loadVoices();
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
      const isLearned = await isWordLearned(id, category, activeChild?.id);
      setGameState((prev) => ({
        ...prev,
        wordAlreadyLearned: isLearned,
        status: isLearned ? "completed" : "initial",
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
      // Save the word as learned
      const wordSaved = await saveLearnedWord(
        {
          id: wordData.id,
          word: wordData.word,
          image: wordData.image,
        },
        category,
        activeChild?.id
      );

      if (!wordSaved) {
        console.error("Failed to save learned word");
        return 0;
      }

      // Calculate XP to award
      const xpEarned = calculateXpEarned();

      // Award XP to the appropriate profile
      const updatedProfile = await updateUserXP(xpEarned, activeChild?.id);

      if (!updatedProfile) {
        console.error("Failed to update XP");
        return 0;
      }

      setGameState((prev) => ({
        ...prev,
        wordAlreadyLearned: true,
        status: "completed",
        xpEarned: xpEarned,
      }));

      return xpEarned;
    } catch (error) {
      console.error("Error saving word and awarding XP:", error);
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

  // Update the pronounceWord function to use current settings
  const pronounceWord = async (): Promise<void> => {
    try {
      if (isPronouncing || !wordData) return;

      setIsPronouncing(true);

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
      ]).start();

      // Add visual feedback for the word
      triggerAnimation(scaleAnim, {
        toValue: 1.05,
        duration: 300,
      });

      // Check if we're currently speaking
      const isSpeaking = await Speech.isSpeakingAsync();
      if (isSpeaking) {
        await Speech.stop();
      }

      // Configure speech options with current settings
      const speechOptions = {
        language: "en-GB",
        pitch: speechPitch,
        rate: speechRate,
        quality: Speech.VoiceQuality.Enhanced,
        voice: selectedVoice?.identifier,
        onStart: () => {
          console.log("Started speaking");
          if (Platform.OS === "ios") {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          }
        },
        onDone: () => {
          setIsPronouncing(false);
          triggerAnimation(scaleAnim, {
            toValue: 1,
            duration: 300,
          });
          if (Platform.OS === "ios") {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          }
        },
        onStopped: () => {
          setIsPronouncing(false);
        },
        onError: (error: any) => {
          console.error("Speech error:", error);
          setIsPronouncing(false);
          if (Platform.OS === "ios") {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
          }
          Alert.alert(
            "Pronunciation Error",
            "Could not play the word pronunciation."
          );
        },
      };

      await Speech.speak(wordData.word, speechOptions);
    } catch (error) {
      console.error("Error pronouncing word:", error);
      setIsPronouncing(false);
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

  // Add function to break word into syllables (simple implementation)
  const breakIntoSyllables = (word: string): string[] => {
    // This is a simple implementation. For production, you'd want to use a proper syllable library
    return (
      word
        .toLowerCase()
        .match(
          /[^aeiouy]*[aeiouy]+(?:[^aeiouy]*$|[^aeiouy](?=[^aeiouy]))?/gi
        ) || [word]
    );
  };

  // Add function to pronounce syllables
  const pronounceSyllables = async (): Promise<void> => {
    try {
      if (isSpeakingSyllable || !wordData) return;

      setIsSpeakingSyllable(true);

      // Create a pulse animation for the syllable button
      Animated.sequence([
        Animated.timing(syllableAnim, {
          toValue: 1.2,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(syllableAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();

      // Check if we're currently speaking
      const isSpeaking = await Speech.isSpeakingAsync();
      if (isSpeaking) {
        await Speech.stop();
      }

      const syllables = breakIntoSyllables(wordData.word);

      // Configure speech options with slower rate for syllables
      const speechOptions = {
        language: "en-GB",
        pitch: speechPitch,
        rate: 0.5, // Slower rate for syllables
        quality: Speech.VoiceQuality.Enhanced,
        voice: selectedVoice?.identifier,
        onStart: () => {
          console.log("Started speaking syllable");
          if (Platform.OS === "ios") {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          }
        },
        onDone: () => {
          setIsSpeakingSyllable(false);
          if (Platform.OS === "ios") {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          }
        },
        onStopped: () => {
          setIsSpeakingSyllable(false);
        },
        onError: (error: any) => {
          console.error("Speech error:", error);
          setIsSpeakingSyllable(false);
          if (Platform.OS === "ios") {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
          }
          Alert.alert("Pronunciation Error", "Could not pronounce syllables.");
        },
      };

      // Pronounce each syllable with a pause between them
      for (let i = 0; i < syllables.length; i++) {
        await Speech.speak(syllables[i], speechOptions);
        if (i < syllables.length - 1) {
          await new Promise((resolve) => setTimeout(resolve, 500)); // 500ms pause between syllables
        }
      }
    } catch (error) {
      console.error("Error pronouncing syllables:", error);
      setIsSpeakingSyllable(false);
      Alert.alert("Pronunciation Error", "Could not pronounce syllables.");
    }
  };

  // Update the renderPronunciationControls function to include the syllable button
  const renderPronunciationControls = (): JSX.Element => (
    <View className="flex-row justify-center items-center gap-2">
      <TouchableOpacity
        onPress={pronounceWord}
        disabled={isPronouncing || isSpeakingSyllable}
        className="w-10 h-10 rounded-full bg-blue-500 justify-center items-center"
        style={{
          transform: [{ scale: pronounceAnim }],
        }}
      >
        <Ionicons
          name={isPronouncing ? "volume-high" : "volume-medium"}
          size={20}
          color="white"
        />
      </TouchableOpacity>

      {wordData && wordData.word.length > 3 && (
        <TouchableOpacity
          onPress={pronounceSyllables}
          disabled={isPronouncing || isSpeakingSyllable}
          className="w-10 h-10 rounded-full bg-purple-500 justify-center items-center"
          style={{
            transform: [{ scale: syllableAnim }],
          }}
        >
          <Ionicons
            name={isSpeakingSyllable ? "text" : "text-outline"}
            size={20}
            color="white"
          />
        </TouchableOpacity>
      )}

      <TouchableOpacity
        onPress={() => setShowTTSSettings(true)}
        className="w-10 h-10 rounded-full bg-gray-500 justify-center items-center"
      >
        <Ionicons name="settings" size={20} color="white" />
      </TouchableOpacity>
    </View>
  );

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
          {renderPronunciationControls()}
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

      <TTSSettingsModal
        isVisible={showTTSSettings}
        onClose={() => setShowTTSSettings(false)}
        availableVoices={availableVoices}
        selectedVoice={selectedVoice}
        onVoiceSelect={setSelectedVoice}
        rate={speechRate}
        onRateChange={setSpeechRate}
        pitch={speechPitch}
        onPitchChange={setSpeechPitch}
      />
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
