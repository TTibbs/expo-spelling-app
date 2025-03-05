import React, { useCallback, useState, useEffect } from "react";
import { View, Text, TouchableOpacity, ScrollView, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import { learningPaths } from "@/lib/data";
import { useChild } from "@/context/ChildContext";
import { PageHeader } from "@/components/PageHeader";
import Tooltip from "react-native-walkthrough-tooltip";
import { getData, storeData, StorageKeys } from "@/lib/storage";

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
      style={{ backgroundColor: `${path.color}20` }}
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
  bgColor: string;
  title: string;
  description: string;
  onPress: () => void;
}> = React.memo(({ icon, iconColor, bgColor, title, description, onPress }) => (
  <TouchableOpacity
    className="mb-4 overflow-hidden rounded-2xl"
    style={{ backgroundColor: bgColor }}
    onPress={onPress}
  >
    <View className="p-5">
      <View className="flex-row items-center justify-between mb-3">
        <View className="flex-row items-center">
          <View
            className="w-10 h-10 rounded-full justify-center items-center mr-3"
            style={{ backgroundColor: iconColor }}
          >
            <Ionicons name={icon as any} color="white" size={20} />
          </View>
          <Text className="text-lg font-bold text-[#1E293B]">{title}</Text>
        </View>
        <Ionicons name="chevron-forward" size={20} color="#94A3B8" />
      </View>
      <Text className="text-[#64748B] leading-5 pr-4">{description}</Text>
    </View>
  </TouchableOpacity>
));

export default function HomeScreen(): JSX.Element {
  const router = useRouter();
  const { activeChild } = useChild();
  const [showTutorial, setShowTutorial] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    checkFirstTimeUser();
  }, []);

  const checkFirstTimeUser = async () => {
    try {
      const hasSeenTutorial = await getData(StorageKeys.HAS_SEEN_TUTORIAL);
      if (!hasSeenTutorial) {
        setShowTutorial(true);
        await storeData(StorageKeys.HAS_SEEN_TUTORIAL, true);
      }
    } catch (error) {
      console.error("Error checking tutorial status:", error);
    }
  };

  const handleNextStep = () => {
    if (currentStep < 2) {
      setCurrentStep(currentStep + 1);
    } else {
      setShowTutorial(false);
    }
  };

  const handleSkipTutorial = () => {
    setShowTutorial(false);
  };

  const handlePathPress = useCallback(
    (path: (typeof learningPaths)[0]) => {
      if (path.available) {
        if (path.id === "spelling") {
          router.push("/learning/words");
        } else if (path.id === "numbers") {
          router.push("/learning/numbers");
        } else if (path.id === "shapes") {
          router.push("/learning/shapes");
        } else {
          alert("Coming soon! This adventure is still being created.");
        }
      } else {
        alert("Coming soon! This adventure is still being created.");
      }
    },
    [router]
  );

  const handleFunFactPress = useCallback(
    (type: string) => {
      switch (type) {
        case "brain":
          router.push("/learning");
          break;
        case "achievements":
          router.push("/profile");
          break;
        case "rewards":
          router.push("/rewards");
          break;
        default:
          break;
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
        <Tooltip
          isVisible={showTutorial && currentStep === 0}
          content={
            <View className="p-4">
              <Text className="text-zinc-900 text-base font-bold mb-2">
                Start Your Learning Journey! 🚀
              </Text>
              <Text className="text-zinc-900 text-sm mb-4">
                Tap here to explore all learning adventures and unlock new
                content!
              </Text>
              <View className="flex-row justify-between">
                <TouchableOpacity
                  onPress={handleSkipTutorial}
                  className="px-4 py-2"
                >
                  <Text className="text-zinc-900 text-sm">Skip</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={handleNextStep}
                  className="bg-white px-4 py-2 rounded-lg"
                >
                  <Text className="text-[#6366F1] font-bold">Next</Text>
                </TouchableOpacity>
              </View>
            </View>
          }
          placement="bottom"
          onClose={() => setShowTutorial(false)}
          backgroundColor="rgba(0,0,0,0.7)"
        >
          <HeaderBanner onPress={() => router.push("/learning")} />
        </Tooltip>

        {/* Quick access to learning paths */}
        <Tooltip
          isVisible={showTutorial && currentStep === 1}
          content={
            <View className="p-4">
              <Text className="text-zinc-900 text-base font-bold mb-2">
                Choose Your Learning Path! 🎯
              </Text>
              <Text className="text-zinc-900 text-sm mb-4">
                Select from different activities like spelling, numbers, and
                shapes. Each path offers unique learning experiences!
              </Text>
              <View className="flex-row justify-between">
                <TouchableOpacity
                  onPress={handleSkipTutorial}
                  className="px-4 py-2"
                >
                  <Text className="text-zinc-900 text-sm">Skip</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={handleNextStep}
                  className="bg-white px-4 py-2 rounded-lg"
                >
                  <Text className="text-[#6366F1] font-bold">Next</Text>
                </TouchableOpacity>
              </View>
            </View>
          }
          placement="bottom"
          onClose={() => setShowTutorial(false)}
          backgroundColor="rgba(0,0,0,0.7)"
        >
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
        </Tooltip>

        {/* Fun facts about learning */}
        <Tooltip
          isVisible={showTutorial && currentStep === 2}
          content={
            <View className="p-4">
              <Text className="text-zinc-900 text-base font-bold mb-2">
                Discover More Features! 🌟
              </Text>
              <Text className="text-zinc-900 text-sm mb-4">
                Explore achievements, rewards, and fun facts to make your
                learning journey even more exciting!
              </Text>
              <View className="flex-row justify-between">
                <TouchableOpacity
                  onPress={handleSkipTutorial}
                  className="px-4 py-2"
                >
                  <Text className="text-zinc-900 text-sm">Skip</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={handleNextStep}
                  className="bg-white px-4 py-2 rounded-lg"
                >
                  <Text className="text-[#6366F1] font-bold">Finish</Text>
                </TouchableOpacity>
              </View>
            </View>
          }
          placement="top"
          onClose={() => setShowTutorial(false)}
          backgroundColor="rgba(0,0,0,0.7)"
        >
          <View className="px-5">
            <View className="flex-row items-center justify-between mb-4">
              <Text className="text-xl font-bold text-[#1E293B]">
                Discover More! 🎯
              </Text>
              <TouchableOpacity>
                <Text className="text-[#6366F1] font-medium">See All</Text>
              </TouchableOpacity>
            </View>

            <FunFactCard
              icon="bulb-outline"
              iconColor="#EC4899"
              bgColor="#FDF2F8"
              title="Power Up Your Mind!"
              description="Every new word you learn creates new connections in your brain. Let's make your brain super strong! 🧠✨"
              onPress={() => handleFunFactPress("brain")}
            />

            <FunFactCard
              icon="trophy"
              iconColor="#10B981"
              bgColor="#ECFDF5"
              title="Unlock Achievements!"
              description="Complete challenges to earn special badges and watch your progress soar to new heights! 🏆"
              onPress={() => handleFunFactPress("achievements")}
            />

            <FunFactCard
              icon="gift"
              iconColor="#8B5CF6"
              bgColor="#F5F3FF"
              title="Earn Cool Rewards!"
              description="Turn your learning adventures into awesome rewards! What will you unlock next? 🎁"
              onPress={() => handleFunFactPress("rewards")}
            />
          </View>
        </Tooltip>
      </ScrollView>
    </SafeAreaView>
  );
}
