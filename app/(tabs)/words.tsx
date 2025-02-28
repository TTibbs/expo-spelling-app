import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";

// Mock data for word categories
const categories = [
  { id: "animals", title: "Animals", icon: "🐘" },
  { id: "fruits", title: "Fruits", icon: "🍎" },
  { id: "colors", title: "Colors", icon: "🌈" },
  { id: "vehicles", title: "Vehicles", icon: "🚗" },
  { id: "nature", title: "Nature", icon: "🌲" },
  { id: "sports", title: "Sports", icon: "⚽" },
];

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

export default function WordsScreen() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState("animals");

  const renderCategoryItem = ({
    item,
  }: {
    item: { id: string; title: string; icon: string };
  }) => (
    <TouchableOpacity
      style={[
        styles.categoryItem,
        selectedCategory === item.id && styles.categoryItemSelected,
      ]}
      onPress={() => setSelectedCategory(item.id)}
    >
      <Text style={styles.categoryIcon}>{item.icon}</Text>
      <Text
        style={[
          styles.categoryTitle,
          selectedCategory === item.id && styles.categoryTitleSelected,
        ]}
      >
        {item.title}
      </Text>
    </TouchableOpacity>
  );

  const renderWordItem = ({
    item,
  }: {
    item: { id: string; word: string; image: string };
  }) => (
    <TouchableOpacity
      style={styles.wordCard}
      onPress={() =>
        router.push({
          pathname: "/word/[id]",
          params: { id: item.id, category: selectedCategory },
        })
      }
    >
      <Image source={{ uri: item.image }} style={styles.wordImage} />
      {/* Removed the word text overlay to hide the spelling */}
      <View style={styles.wordCardOverlay}>
        <Text style={styles.wordCardText}>Tap to spell</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Word Categories</Text>
        <TouchableOpacity style={styles.searchButton}>
          <Ionicons name="search" size={20} color="#64748B" />
        </TouchableOpacity>
      </View>

      <FlatList
        horizontal
        data={categories}
        renderItem={renderCategoryItem}
        keyExtractor={(item) => item.id}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoriesList}
      />

      <View style={styles.wordsContainer}>
        <Text style={styles.sectionTitle}>
          {categories.find((c) => c.id === selectedCategory)?.title || "Words"}
        </Text>

        <FlatList
          data={
            wordsByCategory[selectedCategory as keyof typeof wordsByCategory] ||
            []
          }
          renderItem={renderWordItem}
          keyExtractor={(item) => item.id}
          numColumns={2}
          columnWrapperStyle={styles.wordRow}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.wordsList}
        />
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
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 15,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1E293B",
  },
  searchButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F1F5F9",
    justifyContent: "center",
    alignItems: "center",
  },
  categoriesList: {
    paddingHorizontal: 15,
    height: 200,
  },
  categoryItem: {
    marginHorizontal: 5,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#F1F5F9",
    borderRadius: 12,
    alignItems: "center",
    flexDirection: "row",
  },
  categoryItemSelected: {
    backgroundColor: "#EEF2FF",
  },
  categoryIcon: {
    fontSize: 18,
    marginRight: 8,
  },
  categoryTitle: {
    fontSize: 14,
    fontWeight: "500",
    color: "#64748B",
  },
  categoryTitleSelected: {
    color: "#6366F1",
    fontWeight: "600",
  },
  wordsContainer: {
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1E293B",
    marginBottom: 15,
  },
  wordsList: {
    paddingBottom: 20,
  },
  wordRow: {
    justifyContent: "space-between",
  },
  wordCard: {
    width: "48%",
    height: 120,
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 15,
  },
  wordImage: {
    width: "100%",
    height: "100%",
  },
  wordCardOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    padding: 10,
  },
  wordCardText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 14,
    textAlign: "center",
  },
});
