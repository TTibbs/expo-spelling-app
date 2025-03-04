import React, { useState, useEffect } from "react";
import { View, Text, FlatList, TouchableOpacity, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import { learningPaths } from "@/lib/data";
import { LearningPath } from "@/types/learning";
import { loadUserProfile } from "@/lib/storage";
import { useChild } from "@/context/ChildContext";

export default function LearningScreen() {
  const router = useRouter();
  const { activeChild, isLoading: isChildLoading } = useChild();
  const [userLevel, setUserLevel] = useState<string>("1");
  const [xp, setXp] = useState<number>(0);

  // Load user profile data
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        // Use the centralized loadUserProfile function to get a validated profile
        const profile = await loadUserProfile();
        setUserLevel(activeChild ? activeChild.level : profile.level);
        setXp(activeChild ? activeChild.xp : profile.xp);
      } catch (error) {
        console.error(
          "Failed to load user profile:",
          error instanceof Error ? error.message : "Unknown error"
        );
      }
    };

    fetchUserProfile();
  }, [activeChild]);

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
      className="rounded-2xl mb-4 p-4 shadow-sm"
      style={{ backgroundColor: item.backgroundColor }}
      onPress={() => handlePathPress(item)}
      activeOpacity={0.8}
    >
      <View className="flex-row items-center">
        <View
          className="w-12 h-12 rounded-full justify-center items-center mr-4"
          style={{ backgroundColor: item.iconColor }}
        >
          <Ionicons name={item.icon} size={28} color="white" />
        </View>
        <View className="flex-1">
          <Text className="text-lg font-bold text-slate-800 mb-1">
            {item.title}
          </Text>
          <Text className="text-sm text-slate-500">{item.description}</Text>
        </View>
        {!item.available && (
          <View className="bg-slate-400 px-2 py-1 rounded-xl mr-2">
            <Text className="text-xs font-bold text-white">Coming Soon</Text>
          </View>
        )}
        <Ionicons name="chevron-forward" size={24} color="#64748B" />
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <View className="px-4 py-4 flex-row justify-between items-center">
        <View>
          <Text className="text-2xl font-bold text-slate-800">
            {activeChild
              ? `${activeChild.name}'s Learning Adventures`
              : "Learning Adventures"}
          </Text>
          <Text className="text-base text-slate-500 mt-1">
            Pick a path to start learning!
          </Text>
        </View>
        <TouchableOpacity
          className="bg-indigo-50 p-2 rounded-xl"
          onPress={() => router.push("/profile")}
        >
          <View className="flex-row items-center">
            <Ionicons name="star" color="#6366F1" size={18} />
            <Text className="font-bold text-indigo-500 ml-1">
              Level {userLevel}
            </Text>
          </View>
          <Text className="text-xs text-slate-500 text-center mt-1">
            {xp} XP
          </Text>
        </TouchableOpacity>
      </View>

      <View className="mx-4 h-40 rounded-2xl overflow-hidden mb-6">
        <Image
          source={{
            uri: "https://images.unsplash.com/photo-1577451818680-9abb25a366cd?q=80&w=1000&auto=format&fit=crop",
          }}
          className="w-full h-full"
          resizeMode="cover"
        />
        <View className="absolute bottom-0 left-0 right-0 bg-black/50 p-4">
          <Text className="text-xl font-bold text-white mb-1">
            Unlock Your Potential!
          </Text>
          <Text className="text-sm text-white/90">
            Explore different subjects and earn XP as you learn
          </Text>
        </View>
      </View>

      <FlatList
        data={learningPaths}
        renderItem={renderLearningPath}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 24 }}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}
