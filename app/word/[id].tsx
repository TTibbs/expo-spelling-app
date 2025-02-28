import { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Dimensions,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import Animated, {
  FadeIn,
  FadeOut,
  FlipInYRight,
} from "react-native-reanimated";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Mock data for words
const wordsByCategory = {
  animals: [
    {
      id: "dog",
      word: "DOG",
      image:
        "https://images.unsplash.com/photo-1543466835-00a7907e9de1?q=80&w=500&auto=format&fit=crop",
    },
    {
      id: "cat",
      word: "CAT",
      image:
        "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?q=80&w=500&auto=format&fit=crop",
    },
    {
      id: "elephant",
      word: "ELEPHANT",
      image:
        "https://images.unsplash.com/photo-1557050543-4d5f4e07ef46?q=80&w=500&auto=format&fit=crop",
    },
    {
      id: "lion",
      word: "LION",
      image:
        "https://images.unsplash.com/photo-1546182990-dffeafbe841d?q=80&w=500&auto=format&fit=crop",
    },
    {
      id: "tiger",
      word: "TIGER",
      image:
        "https://images.unsplash.com/photo-1549366021-9f761d450615?q=80&w=500&auto=format&fit=crop",
    },
    {
      id: "zebra",
      word: "ZEBRA",
      image:
        "https://images.unsplash.com/photo-1526095179574-86e545346ae6?q=80&w=500&auto=format&fit=crop",
    },
  ],
  fruits: [
    {
      id: "apple",
      word: "APPLE",
      image:
        "https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?q=80&w=500&auto=format&fit=crop",
    },
    {
      id: "banana",
      word: "BANANA",
      image:
        "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?q=80&w=500&auto=format&fit=crop",
    },
    {
      id: "orange",
      word: "ORANGE",
      image:
        "https://images.unsplash.com/photo-1611080626919-7cf5a9dbab12?q=80&w=500&auto=format&fit=crop",
    },
    {
      id: "strawberry",
      word: "STRAWBERRY",
      image:
        "https://images.unsplash.com/photo-1601004890684-d8cbf643f5f2?q=80&w=500&auto=format&fit=crop",
    },
  ],
  colors: [
    {
      id: "red",
      word: "RED",
      image:
        "https://images.unsplash.com/photo-1580227974546-fbd48825d991?q=80&w=500&auto=format&fit=crop",
    },
    {
      id: "blue",
      word: "BLUE",
      image:
        "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?q=80&w=500&auto=format&fit=crop",
    },
    {
      id: "green",
      word: "GREEN",
      image:
        "https://images.unsplash.com/photo-1564419320461-6870880221ad?q=80&w=500&auto=format&fit=crop",
    },
  ],
  vehicles: [
    {
      id: "car",
      word: "CAR",
      image:
        "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?q=80&w=500&auto=format&fit=crop",
    },
    {
      id: "bus",
      word: "BUS",
      image:
        "https://images.unsplash.com/photo-1570125909232-eb263c188f7e?q=80&w=500&auto=format&fit=crop",
    },
    {
      id: "train",
      word: "TRAIN",
      image:
        "https://images.unsplash.com/photo-1474487548417-781cb71495f3?q=80&w=500&auto=format&fit=crop",
    },
  ],
  nature: [
    {
      id: "tree",
      word: "TREE",
      image:
        "https://images.unsplash.com/photo-1502082553048-f009c37129b9?q=80&w=500&auto=format&fit=crop",
    },
    {
      id: "flower",
      word: "FLOWER",
      image:
        "https://images.unsplash.com/photo-1490750967868-88aa4486c946?q=80&w=500&auto=format&fit=crop",
    },
    {
      id: "mountain",
      word: "MOUNTAIN",
      image:
        "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=500&auto=format&fit=crop",
    },
  ],
  sports: [
    {
      id: "soccer",
      word: "SOCCER",
      image:
        "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?q=80&w=500&auto=format&fit=crop",
    },
    {
      id: "basketball",
      word: "BASKETBALL",
      image:
        "https://images.unsplash.com/photo-1546519638-68e109acd27d?q=80&w=500&auto=format&fit=crop",
    },
    {
      id: "tennis",
      word: "TENNIS",
      image:
        "https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?q=80&w=500&auto=format&fit=crop",
    },
  ],
};

// Generate alphabet buttons
const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

export default function WordDetailScreen() {
  const { id, category } = useLocalSearchParams();
  const router = useRouter();

  // Find the word data
  const wordData = wordsByCategory[
    category as keyof typeof wordsByCategory
  ]?.find((w) => w.id === id);

  const [guessedLetters, setGuessedLetters] = useState<string[]>([]);
  const [correctLetters, setCorrectLetters] = useState<string[]>([]);
  const [incorrectLetters, setIncorrectLetters] = useState<string[]>([]);
  const [gameWon, setGameWon] = useState(false);
  const [wordAlreadyLearned, setWordAlreadyLearned] = useState(false);

  useEffect(() => {
    // Check if this word has already been learned
    checkIfWordLearned();
  }, []);

  const checkIfWordLearned = async () => {
    try {
      const storedWords = await AsyncStorage.getItem("learnedWords");
      if (storedWords) {
        const learnedWords = JSON.parse(storedWords);
        const isLearned = learnedWords.some(
          (word: any) => word.id === id && word.category === category
        );
        setWordAlreadyLearned(isLearned);
      }
    } catch (error) {
      console.error("Failed to check learned words:", error);
    }
  };

  // Save word to learned words
  const saveWordToLearned = async () => {
    if (!wordData) return;

    try {
      // Get current learned words
      const storedWords = await AsyncStorage.getItem("learnedWords");
      let learnedWords = storedWords ? JSON.parse(storedWords) : [];

      // Check if word is already in the list
      const wordExists = learnedWords.some(
        (word: any) => word.id === id && word.category === category
      );

      if (!wordExists) {
        // Add the new word
        learnedWords.push({
          id: wordData.id,
          word: wordData.word,
          category: category,
          image: wordData.image,
          learnedAt: new Date().toISOString(),
        });

        // Save back to storage
        await AsyncStorage.setItem(
          "learnedWords",
          JSON.stringify(learnedWords)
        );
        setWordAlreadyLearned(true);
      }
    } catch (error) {
      console.error("Failed to save learned word:", error);
    }
  };

  // Reset the game
  const resetGame = () => {
    setGuessedLetters([]);
    setCorrectLetters([]);
    setIncorrectLetters([]);
    setGameWon(false);
  };

  // Handle letter press
  const handleLetterPress = (letter: string) => {
    if (guessedLetters.includes(letter) || gameWon) return;

    const newGuessedLetters = [...guessedLetters, letter];
    setGuessedLetters(newGuessedLetters);

    if (wordData?.word.includes(letter)) {
      const newCorrectLetters = [...correctLetters, letter];
      setCorrectLetters(newCorrectLetters);

      // Check if all letters have been guessed
      const uniqueLettersInWord = [...new Set(wordData.word.split(""))];
      const allLettersGuessed = uniqueLettersInWord.every((l) =>
        newCorrectLetters.includes(l)
      );

      if (allLettersGuessed) {
        setGameWon(true);

        // Save the word to learned words
        saveWordToLearned();

        setTimeout(() => {
          Alert.alert(
            "Congratulations!",
            "You've spelled the word correctly! It's now added to your profile.",
            [
              { text: "Play Again", onPress: resetGame },
              { text: "View Profile", onPress: () => router.push("/profile") },
              { text: "Choose Another Word", onPress: () => router.back() },
            ]
          );
        }, 1000);
      }
    } else {
      setIncorrectLetters([...incorrectLetters, letter]);
    }
  };

  // Render word with blanks and guessed letters
  const renderWord = () => {
    if (!wordData) return null;

    return wordData.word.split("").map((letter, index) => {
      const isGuessed = correctLetters.includes(letter);
      return (
        <View key={index} className="mx-1.5 my-1.5 w-[30px] items-center">
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
    });
  };

  if (!wordData) {
    return (
      <SafeAreaView className="flex-1 bg-[#F9F9F9]">
        <Text>Word not found</Text>
      </SafeAreaView>
    );
  }

  const { width } = Dimensions.get("window");
  const keyboardButtonWidth = (width - 60) / 7; // 7 buttons per row with margins

  return (
    <SafeAreaView className="flex-1 bg-[#F9F9F9]">
      <View className="flex-row justify-between items-center px-5 py-4">
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

      <View className="w-full h-[200px] px-5 mb-7 relative">
        <Image
          source={{ uri: wordData.image }}
          className="w-full h-full rounded-2xl"
          resizeMode="cover"
        />
        {wordAlreadyLearned && !gameWon && (
          <View className="absolute top-2.5 right-7 bg-[#6366F1]/90 py-1.5 px-2.5 rounded-xl">
            <Text className="text-white font-bold text-xs">
              Already Learned
            </Text>
          </View>
        )}
      </View>

      <View className="flex-row justify-center items-center mb-10 flex-wrap px-5">
        {renderWord()}
      </View>

      {gameWon && (
        <Animated.View
          entering={FadeIn}
          exiting={FadeOut}
          className="absolute top-1/2 left-0 right-0 items-center justify-center bg-[#6366F1]/90 py-4 -translate-y-6"
        >
          <Text className="text-2xl font-bold text-white">Great Job!</Text>
        </Animated.View>
      )}

      <View className="px-4 pb-5 mt-auto">
        <View className="flex-row flex-wrap justify-center">
          {alphabet.map((letter) => {
            const isGuessed = guessedLetters.includes(letter);
            const isCorrect = correctLetters.includes(letter);

            return (
              <TouchableOpacity
                key={letter}
                className={`w-[${keyboardButtonWidth}px] h-[45px] rounded-lg justify-center items-center m-1 shadow-sm ${
                  isGuessed
                    ? isCorrect
                      ? "bg-[#D1FAE5] border border-[#10B981]"
                      : "bg-[#FEE2E2] border border-[#EF4444]"
                    : "bg-white"
                }`}
                onPress={() => handleLetterPress(letter)}
                disabled={isGuessed || gameWon}
              >
                <Text
                  className={`text-lg font-semibold ${
                    isGuessed
                      ? isCorrect
                        ? "text-[#047857]"
                        : "text-[#B91C1C]"
                      : "text-[#1E293B]"
                  }`}
                >
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
