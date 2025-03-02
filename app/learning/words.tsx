import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Image,
  ListRenderItemInfo,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { wordsByCategory } from "@/lib/data";
import { Word, WordCategory } from "@/types/common";
import Ionicons from "@expo/vector-icons/Ionicons";

// Mock data for word categories
const categories: WordCategory[] = [
  { id: "animals", title: "Animals", icon: "🐘" },
  { id: "fruits", title: "Fruits", icon: "🍎" },
  { id: "colors", title: "Colors", icon: "🌈" },
  { id: "vehicles", title: "Vehicles", icon: "🚗" },
  { id: "nature", title: "Nature", icon: "🌲" },
  { id: "sports", title: "Sports", icon: "⚽" },
];

export default function WordsScreen(): JSX.Element {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState<string>("animals");

  const renderCategoryItem = ({
    item,
  }: ListRenderItemInfo<WordCategory>): JSX.Element => (
    <TouchableOpacity
      className={`mx-1.5 px-4 py-3 ${
        selectedCategory === item.id ? "bg-[#EEF2FF]" : "bg-[#F1F5F9]"
      } rounded-xl items-center flex-row h-[50px]`}
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

  const renderWordItem = ({ item }: ListRenderItemInfo<Word>): JSX.Element => (
    <TouchableOpacity
      className="w-[48%] h-[140px] rounded-xl overflow-hidden mb-4"
      onPress={() =>
        router.push({
          pathname: "/word/[id]",
          params: { id: item.id, category: selectedCategory },
        })
      }
    >
      <Image source={{ uri: item.image }} className="w-full h-full" />
      <View className="absolute bottom-0 left-0 right-0 bg-black/50 p-2.5">
        <Text className="text-white font-bold text-sm text-center">
          Tap to spell
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView className="flex-1 bg-[#F9F9F9]">
      {/* Fixed header section */}
      <View className="flex-row items-center gap-2 px-5 pt-5 pb-4">
        <TouchableOpacity
          className="w-10 h-10 rounded-full bg-[#F1F5F9] justify-center items-center"
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="#1E293B" />
        </TouchableOpacity>
        <Text className="text-2xl font-bold text-[#1E293B]">
          Word Categories
        </Text>
      </View>

      {/* Fixed categories section */}
      <View>
        <FlatList
          horizontal
          data={categories}
          renderItem={renderCategoryItem}
          keyExtractor={(item) => item.id}
          showsHorizontalScrollIndicator={false}
          className="px-4"
          contentContainerStyle={{ paddingBottom: 10 }}
        />
      </View>

      {/* Scrollable words section */}
      <View className="flex-1">
        <Text className="text-lg font-bold text-[#1E293B] mb-4 px-5">
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
          contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 20 }}
        />
      </View>
    </SafeAreaView>
  );
}
