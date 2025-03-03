import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import { shapeActivities } from "@/lib/data";
import { ShapeActivity } from "@/types/shapes";
import { getData, StorageKeys } from "@/lib/storage";

// Define the shape activity interface
export default function ShapesScreen() {
  const router = useRouter();
  const [progress, setProgress] = useState({
    circles: 0,
    squares: 0,
    triangles: 0,
  });

  // Load shape progress from storage
  useEffect(() => {
    const loadProgress = async () => {
      try {
        const shapeStats = await getData(StorageKeys.SHAPE_STATS);
        if (shapeStats) {
          setProgress({
            circles: shapeStats.circles?.completed || 0,
            squares: shapeStats.squares?.completed || 0,
            triangles: shapeStats.triangles?.completed || 0,
          });
        }
      } catch (error) {
        console.error(
          "Error loading shape progress:",
          error instanceof Error ? error.message : "Unknown error"
        );
      }
    };

    loadProgress();
  }, []);

  const handleActivityPress = (activity: ShapeActivity) => {
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

  // Progress indicator component
  const ProgressIndicator = ({
    id,
    completed,
  }: {
    id: string;
    completed: number;
  }) => {
    if (completed === 0) return null;

    return (
      <View className="flex-row items-center mt-1.5">
        <Ionicons name="checkmark-circle" size={14} color="#10B981" />
        <Text className="text-xs text-emerald-500 ml-1 font-medium">
          {completed} completed
        </Text>
      </View>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      {/* Banner */}
      <View className="mx-4 h-40 rounded-xl overflow-hidden mb-6">
        <Image
          source={{
            uri: "https://images.unsplash.com/photo-1633008848202-9c5575a0567b?q=80&w=1000&auto=format&fit=crop",
          }}
          className="w-full h-full"
          resizeMode="cover"
        />
        <View className="absolute bottom-0 left-0 right-0 p-4 bg-black/50">
          <Text className="text-xl font-bold text-white mb-1">
            Shape Adventures!
          </Text>
          <Text className="text-sm text-white/90">
            Explore the world of shapes and patterns
          </Text>
        </View>
      </View>

      {/* Activities List */}
      <ScrollView className="flex-1" contentContainerClassName="px-4 pb-6">
        <Text className="text-lg font-bold text-slate-800 mb-4">
          Choose Your Activity
        </Text>

        {shapeActivities.map((activity) => (
          <TouchableOpacity
            key={activity.id}
            className={`rounded-xl mb-4 p-4 shadow-sm ${
              activity.available ? "bg-white" : "bg-slate-100"
            }`}
            onPress={() => handleActivityPress(activity)}
            activeOpacity={0.7}
          >
            <View className="flex-row items-center">
              <View
                className={`w-12 h-12 rounded-full justify-center items-center mr-4 ${
                  activity.available ? "bg-blue-500" : "bg-slate-300"
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
                {progress[activity.id as keyof typeof progress] > 0 && (
                  <ProgressIndicator
                    id={activity.id}
                    completed={progress[activity.id as keyof typeof progress]}
                  />
                )}
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
