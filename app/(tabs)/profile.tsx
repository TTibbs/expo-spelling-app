import { useState, useEffect } from "react";
import { View, Text, FlatList, Image, TouchableOpacity } from "react-native";
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
      className="bg-white rounded-xl mb-3 overflow-hidden flex-row shadow-sm"
      onPress={() => handleWordPress(item)}
    >
      <Image source={{ uri: item.image }} className="w-20 h-20" />
      <View className="p-3 flex-1 justify-center">
        <Text className="text-base font-bold text-[#1E293B] mb-1">
          {item.word}
        </Text>
        <Text className="text-sm text-[#6366F1] mb-1 capitalize">
          {item.category}
        </Text>
        <Text className="text-xs text-[#94A3B8]">
          Learned: {new Date(item.learnedAt).toLocaleDateString()}
        </Text>
      </View>
    </TouchableOpacity>
  );

  const renderEmptyState = () => (
    <View className="items-center justify-center py-10">
      <Ionicons name="book-outline" color="#CBD5E1" size={60} />
      <Text className="text-lg font-bold text-[#1E293B] mt-4 mb-2">
        No Words Learned Yet
      </Text>
      <Text className="text-sm text-[#64748B] text-center mb-5 px-5">
        Start playing to add words to your collection!
      </Text>
      <TouchableOpacity
        className="bg-[#6366F1] py-3 px-6 rounded-lg"
        onPress={() => router.push("/words")}
      >
        <Text className="text-white font-bold text-base">Start Learning</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-[#F9F9F9]">
      <View className="px-5 pt-5 pb-4">
        <Text className="text-2xl font-bold text-[#1E293B]">
          My Learning Profile
        </Text>
      </View>

      <View className="flex-row justify-between px-5 mb-5">
        <View className="bg-white rounded-xl p-4 items-center w-[30%] shadow-sm">
          <View className="w-10 h-10 rounded-full bg-[#EEF2FF] justify-center items-center mb-2">
            <Ionicons name="book-outline" color="#6366F1" size={20} />
          </View>
          <Text className="text-lg font-bold text-[#1E293B] mb-1">
            {totalWords}
          </Text>
          <Text className="text-xs text-[#64748B] text-center">
            Words Learned
          </Text>
        </View>

        <View className="bg-white rounded-xl p-4 items-center w-[30%] shadow-sm">
          <View className="w-10 h-10 rounded-full bg-[#EEF2FF] justify-center items-center mb-2">
            <Ionicons name="trophy-outline" color="#6366F1" size={20} />
          </View>
          <Text className="text-lg font-bold text-[#1E293B] mb-1">
            {categories}
          </Text>
          <Text className="text-xs text-[#64748B] text-center">Categories</Text>
        </View>

        <View className="bg-white rounded-xl p-4 items-center w-[30%] shadow-sm">
          <View className="w-10 h-10 rounded-full bg-[#EEF2FF] justify-center items-center mb-2">
            <Ionicons name="star-outline" color="#6366F1" size={20} />
          </View>
          <Text className="text-lg font-bold text-[#1E293B] mb-1">
            {totalWords > 0 ? "Level 1" : "Beginner"}
          </Text>
          <Text className="text-xs text-[#64748B] text-center">Level</Text>
        </View>
      </View>

      <View className="flex-1 px-5">
        <View className="flex-row items-center justify-between mb-4">
          <Text className="text-lg font-bold text-[#1E293B]">
            Words I've Learned
          </Text>
          <Ionicons name="trophy-outline" color="#6366F1" size={20} />
        </View>

        {isLoading ? (
          <View className="flex-1 justify-center items-center">
            <Text>Loading...</Text>
          </View>
        ) : (
          <FlatList
            data={learnedWords}
            renderItem={renderWordItem}
            keyExtractor={(item) => `${item.id}-${item.learnedAt}`}
            className="pb-5"
            ListEmptyComponent={renderEmptyState}
          />
        )}
      </View>
    </SafeAreaView>
  );
}
