import { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter } from "expo-router";

// Define the learned word type
type LearnedWord = {
  id: string;
  word: string;
  category: string;
  image: string;
  learnedAt: string;
};

export default function ProfileScreen() {
  const [learnedWords, setLearnedWords] = useState<LearnedWord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Stats for the profile
  const totalWords = learnedWords.length;
  const categories = [...new Set(learnedWords.map((word) => word.category))]
    .length;

  useEffect(() => {
    loadLearnedWords();
  }, []);

  const loadLearnedWords = async () => {
    try {
      setIsLoading(true);
      const storedWords = await AsyncStorage.getItem("learnedWords");
      if (storedWords) {
        setLearnedWords(JSON.parse(storedWords));
      }
    } catch (error) {
      console.error("Failed to load learned words:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleWordPress = (word: LearnedWord) => {
    router.push({
      pathname: "/word/[id]",
      params: { id: word.id, category: word.category },
    });
  };

  const renderWordItem = ({ item }: { item: LearnedWord }) => (
    <TouchableOpacity
      style={styles.wordCard}
      onPress={() => handleWordPress(item)}
    >
      <Image source={{ uri: item.image }} style={styles.wordImage} />
      <View style={styles.wordInfo}>
        <Text style={styles.wordText}>{item.word}</Text>
        <Text style={styles.categoryText}>{item.category}</Text>
        <Text style={styles.dateText}>
          Learned: {new Date(item.learnedAt).toLocaleDateString()}
        </Text>
      </View>
    </TouchableOpacity>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="book-outline" color="#CBD5E1" size={60} />
      <Text style={styles.emptyTitle}>No Words Learned Yet</Text>
      <Text style={styles.emptyText}>
        Start playing to add words to your collection!
      </Text>
      <TouchableOpacity
        style={styles.startButton}
        onPress={() => router.push("/words")}
      >
        <Text style={styles.startButtonText}>Start Learning</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>My Learning Profile</Text>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <View style={styles.statIconContainer}>
            <Ionicons name="book-outline" color="#6366F1" size={20} />
          </View>
          <Text style={styles.statValue}>{totalWords}</Text>
          <Text style={styles.statLabel}>Words Learned</Text>
        </View>

        <View style={styles.statCard}>
          <View style={styles.statIconContainer}>
            <Ionicons name="trophy-outline" color="#6366F1" size={20} />
          </View>
          <Text style={styles.statValue}>{categories}</Text>
          <Text style={styles.statLabel}>Categories</Text>
        </View>

        <View style={styles.statCard}>
          <View style={styles.statIconContainer}>
            <Ionicons name="star-outline" color="#6366F1" size={20} />
          </View>
          <Text style={styles.statValue}>
            {totalWords > 0 ? "Level 1" : "Beginner"}
          </Text>
          <Text style={styles.statLabel}>Level</Text>
        </View>
      </View>

      <View style={styles.wordsContainer}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Words I've Learned</Text>
          <Ionicons name="trophy-outline" color="#6366F1" size={20} />
        </View>

        {isLoading ? (
          <View style={styles.loadingContainer}>
            <Text>Loading...</Text>
          </View>
        ) : (
          <FlatList
            data={learnedWords}
            renderItem={renderWordItem}
            keyExtractor={(item) => `${item.id}-${item.learnedAt}`}
            contentContainerStyle={styles.wordsList}
            ListEmptyComponent={renderEmptyState}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9F9F9",
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 15,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1E293B",
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  statCard: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    width: "30%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  statIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#EEF2FF",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  statValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1E293B",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: "#64748B",
    textAlign: "center",
  },
  wordsContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1E293B",
  },
  wordsList: {
    paddingBottom: 20,
  },
  wordCard: {
    backgroundColor: "white",
    borderRadius: 12,
    marginBottom: 12,
    overflow: "hidden",
    flexDirection: "row",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  wordImage: {
    width: 80,
    height: 80,
  },
  wordInfo: {
    padding: 12,
    flex: 1,
    justifyContent: "center",
  },
  wordText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1E293B",
    marginBottom: 4,
  },
  categoryText: {
    fontSize: 14,
    color: "#6366F1",
    marginBottom: 4,
    textTransform: "capitalize",
  },
  dateText: {
    fontSize: 12,
    color: "#94A3B8",
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1E293B",
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: "#64748B",
    textAlign: "center",
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  startButton: {
    backgroundColor: "#6366F1",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  startButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
