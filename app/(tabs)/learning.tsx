import React from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import { learningPaths } from "@/lib/data";
import { LearningPath } from "@/types/learning";

type IconName = React.ComponentProps<typeof Ionicons>["name"];

export default function LearningScreen() {
  const router = useRouter();

  const handlePathPress = (path: LearningPath) => {
    if (path.available) {
      if (path.id === "spelling") {
        router.push("/learning/words");
      } else if (path.id === "numbers") {
        router.push("/learning/numbers");
      } else if (path.id === "shapes") {
        router.push("/learning/shapes");
      } else {
        // For future paths
        router.push(path.route as any);
      }
    } else {
      alert("Coming soon! This learning path is still being created.");
    }
  };

  const renderLearningPath = ({ item }: { item: LearningPath }) => (
    <TouchableOpacity
      style={[styles.learningCard, { backgroundColor: item.backgroundColor }]}
      onPress={() => handlePathPress(item)}
      activeOpacity={0.8}
    >
      <View style={styles.cardContent}>
        <View
          style={[styles.iconContainer, { backgroundColor: item.iconColor }]}
        >
          <Ionicons name={item.icon} size={28} color="white" />
        </View>
        <View style={styles.cardTextContainer}>
          <Text style={styles.cardTitle}>{item.title}</Text>
          <Text style={styles.cardDescription}>{item.description}</Text>
        </View>
        {!item.available && (
          <View style={styles.comingSoonBadge}>
            <Text style={styles.comingSoonText}>Coming Soon</Text>
          </View>
        )}
        <Ionicons name="chevron-forward" size={24} color="#64748B" />
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Learning Adventures</Text>
        <Text style={styles.subtitle}>Pick a path to start learning!</Text>
      </View>

      <View style={styles.bannerContainer}>
        <Image
          source={{
            uri: "https://images.unsplash.com/photo-1577451818680-9abb25a366cd?q=80&w=1000&auto=format&fit=crop",
          }}
          style={styles.bannerImage}
          resizeMode="cover"
        />
        <View style={styles.bannerOverlay}>
          <Text style={styles.bannerTitle}>Unlock Your Potential!</Text>
          <Text style={styles.bannerText}>
            Explore different subjects and earn XP as you learn
          </Text>
        </View>
      </View>

      <FlatList
        data={learningPaths}
        renderItem={renderLearningPath}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1E293B",
  },
  subtitle: {
    fontSize: 16,
    color: "#64748B",
    marginTop: 4,
  },
  bannerContainer: {
    margin: 16,
    borderRadius: 16,
    overflow: "hidden",
    height: 160,
  },
  bannerImage: {
    width: "100%",
    height: "100%",
  },
  bannerOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    padding: 16,
  },
  bannerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
    marginBottom: 4,
  },
  bannerText: {
    fontSize: 14,
    color: "white",
    opacity: 0.9,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  learningCard: {
    borderRadius: 16,
    marginBottom: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  cardContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  cardTextContainer: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1E293B",
    marginBottom: 4,
  },
  cardDescription: {
    fontSize: 14,
    color: "#64748B",
  },
  comingSoonBadge: {
    backgroundColor: "#94A3B8",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 8,
  },
  comingSoonText: {
    fontSize: 10,
    fontWeight: "bold",
    color: "white",
  },
});
