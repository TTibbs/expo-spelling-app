import { useState } from "react";
import { View, Text, TouchableOpacity, FlatList, Image } from "react-native";
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
      className={`mx-1.5 px-4 py-3 ${
        selectedCategory === item.id ? "bg-[#EEF2FF]" : "bg-[#F1F5F9]"
      } rounded-xl items-center flex-row`}
      onPress={() => setSelectedCategory(item.id)}
    >
      <Text className="text-lg mr-2">{item.icon}</Text>
      <Text
        className={`text-sm font-medium ${
          selectedCategory === item.id
            ? "text-[#6366F1] font-semibold"
            : "text-[#64748B]"
        }`}
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
      className="w-[48%] h-[120px] rounded-xl overflow-hidden mb-4"
      onPress={() =>
        router.push({
          pathname: "/word/[id]",
          params: { id: item.id, category: selectedCategory },
        })
      }
    >
      <Image source={{ uri: item.image }} className="w-full h-full" />
      {/* Removed the word text overlay to hide the spelling */}
      <View className="absolute bottom-0 left-0 right-0 bg-black/50 p-2.5">
        <Text className="text-white font-bold text-sm text-center">
          Tap to spell
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView className="flex-1 bg-[#F9F9F9]">
      <View className="flex-row justify-between items-center px-5 pt-5 pb-4">
        <Text className="text-2xl font-bold text-[#1E293B]">
          Word Categories
        </Text>
        <TouchableOpacity className="w-10 h-10 rounded-full bg-[#F1F5F9] justify-center items-center">
          <Ionicons name="search" size={20} color="#64748B" />
        </TouchableOpacity>
      </View>

      <FlatList
        horizontal
        data={categories}
        renderItem={renderCategoryItem}
        keyExtractor={(item) => item.id}
        showsHorizontalScrollIndicator={false}
        className="px-4 h-[200px]"
      />

      <View className="px-5">
        <Text className="text-lg font-bold text-[#1E293B] mb-4">
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
          columnWrapperStyle={{ justifyContent: "space-between" }}
          showsVerticalScrollIndicator={false}
          className="pb-5"
        />
      </View>
    </SafeAreaView>
  );
}
