import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ShapeActivity } from "@/types/shapes";
import { shapeActivities } from "@/lib/data";

// Define the shape activity interface
export default function ShapesScreen() {
  const router = useRouter();
  const [progress, setProgress] = useState({
    circles: 0,
    squares: 0,
    triangles: 0,
  });

  // Load saved progress
  useEffect(() => {
    const loadProgress = async () => {
      try {
        const shapeStatsStr = await AsyncStorage.getItem("shapeStats");
        if (shapeStatsStr) {
          const shapeStats = JSON.parse(shapeStatsStr);
          setProgress({
            circles: shapeStats.circles?.completed || 0,
            squares: shapeStats.squares?.completed || 0,
            triangles: shapeStats.triangles?.completed || 0,
          });
        }
      } catch (error) {
        console.error("Error loading shape progress:", error);
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
    let color = "#10B981"; // Default green for easy
    let backgroundColor = "#ECFDF5";
    let label = "Easy";

    if (difficulty === "medium") {
      color = "#F59E0B";
      backgroundColor = "#FEF3C7";
      label = "Medium";
    } else if (difficulty === "hard") {
      color = "#EF4444";
      backgroundColor = "#FEE2E2";
      label = "Hard";
    }

    return (
      <View style={[styles.badge, { backgroundColor }]}>
        <Text style={[styles.badgeText, { color }]}>{label}</Text>
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
      <View style={styles.progressBadge}>
        <Ionicons name="checkmark-circle" size={14} color="#10B981" />
        <Text style={styles.progressText}>{completed} completed</Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Banner */}
      <View style={styles.banner}>
        <Image
          source={{
            uri: "https://images.unsplash.com/photo-1633008848202-9c5575a0567b?q=80&w=1000&auto=format&fit=crop",
          }}
          style={styles.bannerImage}
          resizeMode="cover"
        />
        <View style={styles.bannerOverlay}>
          <Text style={styles.bannerTitle}>Shape Adventures!</Text>
          <Text style={styles.bannerText}>
            Explore the world of shapes and patterns
          </Text>
        </View>
      </View>

      {/* Activities List */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.activitiesContainer}
      >
        <Text style={styles.sectionTitle}>Choose Your Activity</Text>

        {shapeActivities.map((activity) => (
          <TouchableOpacity
            key={activity.id}
            style={[
              styles.activityCard,
              { backgroundColor: activity.backgroundColor },
            ]}
            onPress={() => handleActivityPress(activity)}
            activeOpacity={0.7}
          >
            <View style={styles.activityContent}>
              <View
                style={[
                  styles.iconContainer,
                  { backgroundColor: activity.color },
                ]}
              >
                <Ionicons name={activity.icon} size={28} color="white" />
              </View>

              <View style={styles.activityInfo}>
                <View style={styles.activityHeader}>
                  <Text style={styles.activityTitle}>{activity.title}</Text>
                  <DifficultyBadge difficulty={activity.difficulty} />
                </View>
                <Text style={styles.activityDescription}>
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
                <View style={styles.lockIcon}>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9F9F9",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backButton: {
    marginRight: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1E293B",
  },
  banner: {
    marginHorizontal: 16,
    height: 160,
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 24,
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
    padding: 16,
    backgroundColor: "rgba(0,0,0,0.5)",
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
  scrollView: {
    flex: 1,
  },
  activitiesContainer: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1E293B",
    marginBottom: 16,
  },
  activityCard: {
    borderRadius: 12,
    marginBottom: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  activityContent: {
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
  activityInfo: {
    flex: 1,
  },
  activityHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  activityTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1E293B",
    marginRight: 8,
  },
  activityDescription: {
    fontSize: 14,
    color: "#64748B",
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: "bold",
  },
  lockIcon: {
    marginRight: 8,
  },
  progressBadge: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 6,
  },
  progressText: {
    fontSize: 12,
    color: "#10B981",
    marginLeft: 4,
    fontWeight: "500",
  },
});
