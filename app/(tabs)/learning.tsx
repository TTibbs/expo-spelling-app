import React from "react";
import { View, Text, FlatList, TouchableOpacity, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import { learningPaths } from "@/lib/data";
import { LearningPath } from "@/types/learning";
import { useChild } from "@/context/ChildContext";
import { useProfileData } from "@/hooks/useProfileData";
import { PageHeader } from "@/components/PageHeader";

// Extracted components for better organization and reusability
const ProfileBadge: React.FC<{
  level: string;
  xp: number;
  onPress: () => void;
}> = React.memo(({ level, xp, onPress }) => (
  <TouchableOpacity className="bg-indigo-50 p-2 rounded-xl" onPress={onPress}>
    <View className="flex-row items-center">
      <Ionicons name="star" color="#6366F1" size={18} />
      <Text className="font-bold text-indigo-500 ml-1">Level {level}</Text>
    </View>
    <Text className="text-xs text-slate-500 text-center mt-1">{xp} XP</Text>
  </TouchableOpacity>
));

const HeaderBanner: React.FC = React.memo(() => (
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
));

const LearningPathCard: React.FC<{
  path: LearningPath;
  onPress: (path: LearningPath) => void;
}> = React.memo(({ path, onPress }) => (
  <TouchableOpacity
    className="rounded-2xl mb-4 p-4 shadow-sm"
    style={{ backgroundColor: path.backgroundColor }}
    onPress={() => onPress(path)}
    activeOpacity={0.8}
  >
    <View className="flex-row items-center">
      <View
        className="w-12 h-12 rounded-full justify-center items-center mr-4"
        style={{ backgroundColor: path.iconColor }}
      >
        <Ionicons name={path.icon} size={28} color="white" />
      </View>
      <View className="flex-1">
        <Text className="text-lg font-bold text-slate-800 mb-1">
          {path.title}
        </Text>
        <Text className="text-sm text-slate-500">{path.description}</Text>
      </View>
      {!path.available && (
        <View className="bg-slate-400 px-2 py-1 rounded-xl mr-2">
          <Text className="text-xs font-bold text-white">Coming Soon</Text>
        </View>
      )}
      <Ionicons name="chevron-forward" size={24} color="#64748B" />
    </View>
  </TouchableOpacity>
));

export default function LearningScreen() {
  const router = useRouter();
  const { activeChild } = useChild();
  const { userLevel, xp } = useProfileData();

  const handlePathPress = React.useCallback(
    (path: LearningPath) => {
      if (!path.available) {
        alert("Coming soon! This learning path is still being created.");
        return;
      }

      router.push(path.route as any);
    },
    [router]
  );

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <PageHeader
        title={
          activeChild
            ? `${activeChild.name}'s Learning Adventures`
            : "Learning Adventures"
        }
        subtitle="Pick a path to start learning!"
      />

      <HeaderBanner />

      <FlatList
        data={learningPaths}
        renderItem={({ item }) => (
          <LearningPathCard path={item} onPress={handlePathPress} />
        )}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 24 }}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}
