import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";

export default function HomeScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>SpellMaster</Text>
          <Text style={styles.subtitle}>Learn spelling the fun way!</Text>
        </View>

        <View style={styles.heroContainer}>
          <Image
            source={{
              uri: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=1000&auto=format&fit=crop",
            }}
            style={styles.heroImage}
            resizeMode="cover"
          />
          <View style={styles.heroOverlay}>
            <Text style={styles.heroText}>Start your spelling adventure!</Text>
            <TouchableOpacity
              style={styles.heroButton}
              onPress={() => router.push("/words")}
            >
              <Text style={styles.heroButtonText}>Play Now</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.featuresContainer}>
          <Text style={styles.sectionTitle}>How It Works</Text>

          <View style={styles.featureCard}>
            <View style={styles.featureIconContainer}>
              <Ionicons name="book-outline" color="#6366F1" size={24} />
            </View>
            <View style={styles.featureContent}>
              <Text style={styles.featureTitle}>Choose a Word</Text>
              <Text style={styles.featureDescription}>
                Select from our collection of words to practice your spelling
                skills.
              </Text>
            </View>
          </View>

          <View style={styles.featureCard}>
            <View style={styles.featureIconContainer}>
              <Ionicons name="bulb-outline" color="#6366F1" size={24} />
            </View>
            <View style={styles.featureContent}>
              <Text style={styles.featureTitle}>Guess Letters</Text>
              <Text style={styles.featureDescription}>
                Tap letters to reveal the hidden word, hangman-style.
              </Text>
            </View>
          </View>

          <View style={styles.featureCard}>
            <View style={styles.featureIconContainer}>
              <Ionicons name="trophy-outline" color="#6366F1" size={24} />
            </View>
            <View style={styles.featureContent}>
              <Text style={styles.featureTitle}>Learn & Improve</Text>
              <Text style={styles.featureDescription}>
                Build your vocabulary and spelling skills with each game.
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

import { BookOpen } from "lucide-react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9F9F9",
  },
  scrollContent: {
    paddingBottom: 30,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#1E293B",
  },
  subtitle: {
    fontSize: 16,
    color: "#64748B",
    marginTop: 5,
  },
  heroContainer: {
    marginHorizontal: 20,
    marginVertical: 15,
    borderRadius: 16,
    overflow: "hidden",
    height: 200,
  },
  heroImage: {
    width: "100%",
    height: "100%",
  },
  heroOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    padding: 20,
  },
  heroText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  heroButton: {
    backgroundColor: "#6366F1",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignSelf: "flex-start",
  },
  heroButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  featuresContainer: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1E293B",
    marginBottom: 15,
  },
  featureCard: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  featureIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#EEF2FF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1E293B",
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 14,
    color: "#64748B",
    lineHeight: 20,
  },
});
