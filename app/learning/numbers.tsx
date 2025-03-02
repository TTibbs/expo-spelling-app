import React from "react";
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

  return (
    <SafeAreaView style={styles.container}>
      {/* Banner */}
      <View style={styles.banner}>
        <Image
          source={{
            uri: "https://images.unsplash.com/photo-1596495577886-d920f1fb7238?q=80&w=1000&auto=format&fit=crop",
          }}
          style={styles.bannerImage}
          resizeMode="cover"
        />
        <View style={styles.bannerOverlay}>
          <Text style={styles.bannerTitle}>Math Adventures!</Text>
          <Text style={styles.bannerText}>
            Explore the world of numbers through fun games and activities
          </Text>
        </View>
      </View>

      {/* Activities List */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.activitiesContainer}
      >
        <Text style={styles.sectionTitle}>Choose Your Activity</Text>

        {mathActivities.map((activity) => (
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
});
