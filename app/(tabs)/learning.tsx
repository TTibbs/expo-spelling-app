import React from "react";
import { View, Text, TouchableOpacity, ScrollView, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";

// Define learning path types
interface LearningPath {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentProps<typeof Ionicons>["name"]; // Using the proper type for Ionicons
  iconColor: string;
  backgroundColor: string;
  route: string; // Where this learning path should navigate to
}

// Learning paths data
const learningPaths: LearningPath[] = [
  {
    id: "spelling",
    title: "Spelling & Words",
    description: "Learn to spell words from different categories",
    icon: "book-outline" as React.ComponentProps<typeof Ionicons>["name"],
    iconColor: "#6366F1",
    backgroundColor: "#EEF2FF",
    route: "/learning/words", // Updated route to the words screen
  },
  {
    id: "numbers",
    title: "Numbers & Counting",
    description: "Learn numbers and basic counting skills",
    icon: "calculator-outline" as React.ComponentProps<typeof Ionicons>["name"],
    iconColor: "#10B981",
    backgroundColor: "#ECFDF5",
    route: "/learning/numbers", // Future route for numbers learning
  },
  {
    id: "shapes",
    title: "Shapes & Colors",
    description: "Identify and learn different shapes and colors",
    icon: "shapes-outline" as React.ComponentProps<typeof Ionicons>["name"],
    iconColor: "#F59E0B",
    backgroundColor: "#FEF3C7",
    route: "/learning/shapes", // Future route for shapes learning
  },
  {
    id: "phonics",
    title: "Phonics",
    description: "Learn letter sounds and phonetic reading",
    icon: "mic-outline" as React.ComponentProps<typeof Ionicons>["name"],
    iconColor: "#EC4899",
    backgroundColor: "#FCE7F3",
    route: "/learning/phonics", // Future route for phonics
  },
  {
    id: "memory",
    title: "Memory Games",
    description: "Fun games to improve memory and recall",
    icon: "extension-puzzle-outline" as React.ComponentProps<
      typeof Ionicons
    >["name"],
    iconColor: "#8B5CF6",
    backgroundColor: "#EDE9FE",
    route: "/learning/memory", // Future route for memory games
  },
  {
    id: "reading",
    title: "Reading & Stories",
    description: "Simple stories with comprehension activities",
    icon: "library-outline" as React.ComponentProps<typeof Ionicons>["name"],
    iconColor: "#0EA5E9",
    backgroundColor: "#E0F2FE",
    route: "/learning/reading", // Future route for reading
  },
];

export default function LearningScreen(): JSX.Element {
  const router = useRouter();

  const handlePathPress = (path: LearningPath) => {
    if (path.id === "spelling") {
      // Navigate to the existing words screen
      router.push("/learning/words");
    } else {
      // For now, show a "coming soon" message for other paths
      alert(`${path.title} is coming soon!`);
      // In the future, you would navigate to the specific route
      // router.push(path.route);
    }
  };

  // Render a learning path card
  const renderLearningPath = (path: LearningPath) => (
    <TouchableOpacity
      key={path.id}
      className="bg-white rounded-xl overflow-hidden shadow-sm mb-4"
      style={{ width: "48%" }}
      onPress={() => handlePathPress(path)}
    >
      <View
        className="p-4 items-center justify-center"
        style={{ backgroundColor: path.backgroundColor, height: 100 }}
      >
        <Ionicons name={path.icon} size={50} color={path.iconColor} />
      </View>
      <View className="p-4">
        <Text className="text-lg font-bold text-[#1E293B] mb-1">
          {path.title}
        </Text>
        <Text className="text-sm text-[#64748B]" numberOfLines={2}>
          {path.description}
        </Text>
      </View>
      {path.id === "spelling" && (
        <View className="absolute top-2 right-2 bg-[#6366F1] rounded-full px-2 py-1">
          <Text className="text-white text-xs font-bold">Available</Text>
        </View>
      )}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView className="flex-1 bg-[#F9F9F9]">
      {/* Header section */}
      <View className="flex-row justify-between items-center px-5 pt-5 pb-4">
        <Text className="text-2xl font-bold text-[#1E293B]">
          Learning Paths
        </Text>
      </View>

      {/* Featured learning path */}
      <View className="px-5 mb-5">
        <TouchableOpacity
          className="bg-white rounded-xl overflow-hidden shadow-sm"
          onPress={() => router.push("/learning/words")}
        >
          <View className="h-[120px] bg-[#EEF2FF] p-5 flex-row items-center">
            <View className="flex-1">
              <Text className="text-[#6366F1] font-bold mb-1">FEATURED</Text>
              <Text className="text-xl font-bold text-[#1E293B] mb-1">
                Word Spelling Challenge
              </Text>
              <Text className="text-[#64748B]">
                Master spelling with fun interactive challenges
              </Text>
            </View>
            <View className="items-center justify-center h-16 w-16 bg-[#6366F1] rounded-full">
              <Ionicons name="book-outline" size={30} color="white" />
            </View>
          </View>
          <View className="p-4 flex-row justify-between items-center">
            <Text className="text-[#64748B]">6 categories available</Text>
            <View className="flex-row items-center">
              <Text className="text-[#6366F1] font-bold mr-1">Start Now</Text>
              <Ionicons name="arrow-forward" size={16} color="#6366F1" />
            </View>
          </View>
        </TouchableOpacity>
      </View>

      {/* All learning paths section */}
      <Text className="text-lg font-bold text-[#1E293B] mb-4 px-5">
        All Learning Activities
      </Text>

      <ScrollView className="flex-1 px-5">
        <View className="flex-row flex-wrap justify-between">
          {learningPaths.map(renderLearningPath)}
        </View>
        <View className="h-20" />
      </ScrollView>
    </SafeAreaView>
  );
}
