import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, ScrollView, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import { loadUserProfile } from "@/lib/storage";
import { learningPaths } from "@/lib/data";

export default function HomeScreen(): JSX.Element {
  const router = useRouter();
  const [userName, setUserName] = useState<string>("Learner");
  const [userLevel, setUserLevel] = useState<string>("1");
  const [xp, setXp] = useState<number>(0);

  // Load user profile data
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        // Use the centralized loadUserProfile function to get a validated profile
        const profile = await loadUserProfile();
        setUserLevel(profile.level);
        setXp(profile.xp);
        // Note: UserProfile doesn't include a name property
        // We're keeping the default "Learner" name set in useState
      } catch (error) {
        console.error(
          "Failed to load user profile:",
          error instanceof Error ? error.message : "Unknown error"
        );
      }
    };

    fetchUserProfile();
  }, []);

  return (
    <SafeAreaView className="flex-1 bg-[#F9F9F9]">
      <ScrollView className="pb-[30px]">
        {/* Header with level badge */}
        <View className="flex-row justify-between items-center px-5 pt-5 pb-2.5">
          <View>
            <Text className="text-3xl font-bold text-[#1E293B]">
              Hey there! 👋
            </Text>
            <Text className="text-base text-[#64748B] mt-1.5">
              Ready for some fun learning?
            </Text>
          </View>
          <TouchableOpacity
            className="bg-[#EEF2FF] p-2 rounded-xl"
            onPress={() => router.push("/profile")}
          >
            <View className="flex-row items-center">
              <Ionicons name="star" color="#6366F1" size={18} />
              <Text className="ml-1 font-bold text-[#6366F1]">
                Level {userLevel}
              </Text>
            </View>
            <Text className="text-xs text-[#64748B] text-center mt-1">
              {xp} XP
            </Text>
          </TouchableOpacity>
        </View>

        {/* Banner with cool image */}
        <View className="mx-5 my-4 rounded-2xl overflow-hidden h-[180px]">
          <Image
            source={{
              uri: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=1000&auto=format&fit=crop",
            }}
            className="w-full h-full"
            resizeMode="cover"
          />
          <View className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-5">
            <Text className="text-white text-lg font-bold mb-2.5">
              Unlock all learning adventures!
            </Text>
            <TouchableOpacity
              className="bg-[#6366F1] py-2.5 px-5 rounded-lg self-start"
              onPress={() => router.push("/learning")}
            >
              <Text className="text-white font-bold">Start Learning</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Quick access to learning paths */}
        <View className="px-5 mb-4">
          <Text className="text-xl font-bold text-[#1E293B] mb-4">
            Pick your adventure! ✨
          </Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {learningPaths.map((path) => (
              <TouchableOpacity
                key={path.id}
                className="mr-4 items-center"
                onPress={() => {
                  if (path.available) {
                    if (path.id === "spelling") {
                      router.push("/learning/words");
                    } else if (path.id === "numbers") {
                      router.push("/learning/numbers");
                    } else {
                      // For other paths, show coming soon message
                      alert(
                        "Coming soon! This adventure is still being created."
                      );
                    }
                  } else {
                    alert(
                      "Coming soon! This adventure is still being created."
                    );
                  }
                }}
              >
                <View
                  className="w-16 h-16 rounded-full items-center justify-center mb-2"
                  style={{ backgroundColor: path.color }}
                >
                  <Ionicons name={path.icon} size={28} color={path.color} />
                  {!path.available && (
                    <View className="absolute right-0 bottom-0 bg-[#94A3B8] rounded-full w-6 h-6 items-center justify-center">
                      <Ionicons name="lock-closed" size={12} color="white" />
                    </View>
                  )}
                </View>
                <Text className="text-sm font-medium text-[#334155]">
                  {path.title}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Daily challenge */}
        <View className="mx-5 mb-5 bg-[#EEF2FF] p-4 rounded-xl">
          <View className="flex-row items-center mb-2">
            <Ionicons name="calendar" size={20} color="#6366F1" />
            <Text className="text-base font-bold text-[#1E293B] ml-2">
              Daily Challenge
            </Text>
          </View>
          <Text className="text-[#64748B] mb-3">
            Complete today's tasks to earn bonus XP!
          </Text>
          <TouchableOpacity
            className="bg-[#6366F1] py-2 rounded-lg items-center"
            onPress={() => router.push("/chores")}
          >
            <Text className="text-white font-bold">View Challenges</Text>
          </TouchableOpacity>
        </View>

        {/* Fun facts about learning */}
        <View className="p-5">
          <Text className="text-xl font-bold text-[#1E293B] mb-4">
            Did you know? 🧠
          </Text>

          <View className="bg-white rounded-xl p-4 mb-3 flex-row items-center shadow-sm">
            <View className="w-12 h-12 rounded-full bg-[#FCE7F3] justify-center items-center mr-4">
              <Ionicons name="bulb-outline" color="#EC4899" size={24} />
            </View>
            <View className="flex-1">
              <Text className="text-base font-bold text-[#1E293B] mb-1">
                Supercharge Your Brain!
              </Text>
              <Text className="text-sm text-[#64748B] leading-5">
                Learning new words can make your brain stronger and help you
                become a better reader!
              </Text>
            </View>
          </View>

          <View className="bg-white rounded-xl p-4 mb-3 flex-row items-center shadow-sm">
            <View className="w-12 h-12 rounded-full bg-[#ECFDF5] justify-center items-center mr-4">
              <Ionicons name="trophy-outline" color="#10B981" size={24} />
            </View>
            <View className="flex-1">
              <Text className="text-base font-bold text-[#1E293B] mb-1">
                Earn XP, Level Up!
              </Text>
              <Text className="text-sm text-[#64748B] leading-5">
                Complete challenges to collect XP and unlock new levels and
                achievements!
              </Text>
            </View>
          </View>

          <View className="bg-white rounded-xl p-4 mb-3 flex-row items-center shadow-sm">
            <View className="w-12 h-12 rounded-full bg-[#EDE9FE] justify-center items-center mr-4">
              <Ionicons name="list-outline" color="#8B5CF6" size={24} />
            </View>
            <View className="flex-1">
              <Text className="text-base font-bold text-[#1E293B] mb-1">
                Complete Chores, Get Rewards!
              </Text>
              <Text className="text-sm text-[#64748B] leading-5">
                Finish your tasks to earn bonus points and unlock more fun
                activities!
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
