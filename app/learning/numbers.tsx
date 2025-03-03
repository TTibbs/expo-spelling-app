import React from "react";
import { View, Text, TouchableOpacity, ScrollView, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import { MathActivity } from "@/types/numbers";
import { mathActivities } from "@/lib/data";

export default function NumbersScreen() {
  const router = useRouter();

  const handleActivityPress = (activity: MathActivity) => {
    if (activity.available) {
      router.push(activity.route as any);
    } else {
      alert("Coming soon! This activity is still being created.");
    }
  };

  // Difficulty badge component
  const DifficultyBadge = ({ difficulty }: { difficulty: string }) => {
    let color = "text-emerald-500"; // Default green for easy
    let backgroundColor = "bg-emerald-50";
    let label = "Easy";

    if (difficulty === "medium") {
      color = "text-amber-500";
      backgroundColor = "bg-amber-50";
      label = "Medium";
    } else if (difficulty === "hard") {
      color = "text-red-500";
      backgroundColor = "bg-red-50";
      label = "Hard";
    }

    return (
      <View className={`px-2 py-0.5 rounded-full ${backgroundColor}`}>
        <Text className={`text-xs font-bold ${color}`}>{label}</Text>
      </View>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      {/* Banner */}
      <View className="mx-4 h-40 rounded-xl overflow-hidden mb-6">
        <Image
          source={{
            uri: "https://images.unsplash.com/photo-1596495577886-d920f1fb7238?q=80&w=1000&auto=format&fit=crop",
          }}
          className="w-full h-full"
          resizeMode="cover"
        />
        <View className="absolute bottom-0 left-0 right-0 p-4 bg-black/50">
          <Text className="text-xl font-bold text-white mb-1">
            Math Adventures!
          </Text>
          <Text className="text-sm text-white/90">
            Explore the world of numbers through fun games and activities
          </Text>
        </View>
      </View>

      {/* Activities List */}
      <ScrollView className="flex-1" contentContainerClassName="px-4 pb-6">
        <Text className="text-lg font-bold text-slate-800 mb-4">
          Choose Your Activity
        </Text>

        {mathActivities.map((activity) => (
          <TouchableOpacity
            key={activity.id}
            className={`rounded-xl mb-4 p-4 shadow-sm ${
              activity.backgroundColor
                ? `bg-[${activity.backgroundColor}]`
                : "bg-white"
            }`}
            onPress={() => handleActivityPress(activity)}
            activeOpacity={0.7}
          >
            <View className="flex-row items-center">
              <View
                className={`w-12 h-12 rounded-full justify-center items-center mr-4 ${
                  activity.color ? `bg-[${activity.color}]` : "bg-blue-500"
                }`}
              >
                <Ionicons name={activity.icon} size={28} color="white" />
              </View>

              <View className="flex-1">
                <View className="flex-row items-center mb-1">
                  <Text className="text-base font-bold text-slate-800 mr-2">
                    {activity.title}
                  </Text>
                  <DifficultyBadge difficulty={activity.difficulty} />
                </View>
                <Text className="text-sm text-slate-500">
                  {activity.description}
                </Text>
              </View>

              {!activity.available && (
                <View className="mr-2">
                  <Ionicons name="lock-closed" size={20} color="#94A3B8" />
                </View>
              )}

              <Ionicons name="chevron-forward" size={24} color="#64748B" />
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}
