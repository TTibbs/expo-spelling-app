import React, { useCallback } from "react";
import { View, Text, TouchableOpacity, ScrollView, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import { learningPaths } from "@/lib/data";
import { useChild } from "@/context/ChildContext";
import { useProfileData } from "@/hooks/useProfileData";
import { PageHeader } from "@/components/PageHeader";

// Extracted components for better organization and reusability
const ProfileBadge: React.FC<{
  level: string;
  xp: number;
  onPress: () => void;
}> = React.memo(({ level, xp, onPress }) => (
  <TouchableOpacity className="bg-[#EEF2FF] p-2 rounded-xl" onPress={onPress}>
    <View className="flex-row items-center">
      <Ionicons name="star" color="#6366F1" size={18} />
      <Text className="ml-1 font-bold text-[#6366F1]">Level {level}</Text>
    </View>
    <Text className="text-xs text-[#64748B] text-center mt-1">{xp} XP</Text>
  </TouchableOpacity>
));

const HeaderBanner: React.FC<{ onPress: () => void }> = React.memo(
  ({ onPress }) => (
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
          onPress={onPress}
        >
          <Text className="text-white font-bold">Start Learning</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
);

const LearningPathCard: React.FC<{
  path: (typeof learningPaths)[0];
  onPress: (path: (typeof learningPaths)[0]) => void;
}> = React.memo(({ path, onPress }) => (
  <TouchableOpacity className="mr-4 items-center" onPress={() => onPress(path)}>
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
    <Text className="text-sm font-medium text-[#334155]">{path.title}</Text>
  </TouchableOpacity>
));

const FunFactCard: React.FC<{
  icon: string;
  iconColor: string;
  title: string;
  description: string;
}> = React.memo(({ icon, iconColor, title, description }) => (
  <View className="bg-white rounded-xl p-4 mb-3 flex-row items-center shadow-sm">
    <View
      className="w-12 h-12 rounded-full justify-center items-center mr-4"
      style={{ backgroundColor: iconColor }}
    >
      <Ionicons name={icon as any} color={iconColor} size={24} />
    </View>
    <View className="flex-1">
      <Text className="text-base font-bold text-[#1E293B] mb-1">{title}</Text>
      <Text className="text-sm text-[#64748B] leading-5">{description}</Text>
    </View>
  </View>
));

export default function HomeScreen(): JSX.Element {
  const router = useRouter();
  const { activeChild } = useChild();
  const { userLevel, xp } = useProfileData();

  const handlePathPress = useCallback(
    (path: (typeof learningPaths)[0]) => {
      if (path.available) {
        if (path.id === "spelling") {
          router.push("/learning/words");
        } else if (path.id === "numbers") {
          router.push("/learning/numbers");
        } else {
          alert("Coming soon! This adventure is still being created.");
        }
      } else {
        alert("Coming soon! This adventure is still being created.");
      }
    },
    [router]
  );

  return (
    <SafeAreaView className="flex-1 bg-[#F9F9F9]">
      <ScrollView className="pb-[30px]">
        <PageHeader
          title={`Hey ${activeChild ? activeChild.name : "there"}! 👋`}
          subtitle="Ready for some fun learning?"
        />

        {/* Banner with cool image */}
        <HeaderBanner onPress={() => router.push("/learning")} />

        {/* Quick access to learning paths */}
        <View className="px-5 mb-4">
          <Text className="text-xl font-bold text-[#1E293B] mb-4">
            Pick your adventure! ✨
          </Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {learningPaths.map((path) => (
              <LearningPathCard
                key={path.id}
                path={path}
                onPress={handlePathPress}
              />
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

          <FunFactCard
            icon="bulb-outline"
            iconColor="#FCE7F3"
            title="Supercharge Your Brain!"
            description="Learning new words can make your brain stronger and help you become a better reader!"
          />

          <FunFactCard
            icon="trophy-outline"
            iconColor="#ECFDF5"
            title="Earn XP, Level Up!"
            description="Complete challenges to collect XP and unlock new levels and achievements!"
          />

          <FunFactCard
            icon="list-outline"
            iconColor="#EDE9FE"
            title="Complete Chores, Get Rewards!"
            description="Finish your tasks to earn bonus points and unlock more fun activities!"
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
