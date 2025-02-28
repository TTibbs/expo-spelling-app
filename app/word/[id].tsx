import { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
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
        <View key={index} style={styles.letterContainer}>
          {isGuessed ? (
            <Animated.Text
              entering={FlipInYRight.delay(index * 100)}
              style={styles.letter}
            >
              {letter}
            </Animated.Text>
          ) : (
            <Text style={styles.letterBlank}>_</Text>
          )}
        </View>
      );
    });
  };

  if (!wordData) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>Word not found</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="#1E293B" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.resetButton} onPress={resetGame}>
          <Ionicons name="refresh" size={20} color="#1E293B" />
        </TouchableOpacity>
      </View>

      <View style={styles.imageContainer}>
        <Image
          source={{ uri: wordData.image }}
          style={styles.image}
          resizeMode="cover"
        />
        {wordAlreadyLearned && !gameWon && (
          <View style={styles.learnedBadge}>
            <Text style={styles.learnedText}>Already Learned</Text>
          </View>
        )}
      </View>

      <View style={styles.wordContainer}>{renderWord()}</View>

      {gameWon && (
        <Animated.View
          entering={FadeIn}
          exiting={FadeOut}
          style={styles.congratsContainer}
        >
          <Text style={styles.congratsText}>Great Job!</Text>
        </Animated.View>
      )}

      <View style={styles.keyboardContainer}>
        <View style={styles.keyboard}>
          {alphabet.map((letter) => {
            const isGuessed = guessedLetters.includes(letter);
            const isCorrect = correctLetters.includes(letter);

            return (
              <TouchableOpacity
                key={letter}
                style={[
                  styles.keyboardButton,
                  isGuessed &&
                    (isCorrect ? styles.correctButton : styles.incorrectButton),
                ]}
                onPress={() => handleLetterPress(letter)}
                disabled={isGuessed || gameWon}
              >
                <Text
                  style={[
                    styles.keyboardButtonText,
                    isGuessed &&
                      (isCorrect
                        ? styles.correctButtonText
                        : styles.incorrectButtonText),
                  ]}
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

const { width } = Dimensions.get("window");
const keyboardButtonWidth = (width - 60) / 7; // 7 buttons per row with margins

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9F9F9",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F1F5F9",
    justifyContent: "center",
    alignItems: "center",
  },
  resetButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F1F5F9",
    justifyContent: "center",
    alignItems: "center",
  },
  imageContainer: {
    width: "100%",
    height: 200,
    paddingHorizontal: 20,
    marginBottom: 30,
    position: "relative",
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: 16,
  },
  learnedBadge: {
    position: "absolute",
    top: 10,
    right: 30,
    backgroundColor: "rgba(99, 102, 241, 0.9)",
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 12,
  },
  learnedText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 12,
  },
  wordContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 40,
    flexWrap: "wrap",
    paddingHorizontal: 20,
  },
  letterContainer: {
    marginHorizontal: 5,
    marginVertical: 5,
    width: 30,
    alignItems: "center",
  },
  letter: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1E293B",
  },
  letterBlank: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#94A3B8",
  },
  congratsContainer: {
    position: "absolute",
    top: "50%",
    left: 0,
    right: 0,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(99, 102, 241, 0.9)",
    paddingVertical: 15,
    transform: [{ translateY: -25 }],
  },
  congratsText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
  },
  keyboardContainer: {
    paddingHorizontal: 15,
    paddingBottom: 20,
    marginTop: "auto",
  },
  keyboard: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
  },
  keyboardButton: {
    width: keyboardButtonWidth,
    height: 45,
    borderRadius: 8,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    margin: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  keyboardButtonText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1E293B",
  },
  correctButton: {
    backgroundColor: "#D1FAE5",
    borderColor: "#10B981",
    borderWidth: 1,
  },
  incorrectButton: {
    backgroundColor: "#FEE2E2",
    borderColor: "#EF4444",
    borderWidth: 1,
  },
  correctButtonText: {
    color: "#047857",
  },
  incorrectButtonText: {
    color: "#B91C1C",
  },
});
