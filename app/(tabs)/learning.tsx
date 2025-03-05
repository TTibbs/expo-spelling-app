import React, { useState, useEffect } from "react";
import { View, Text, FlatList, TouchableOpacity, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import { learningPaths } from "@/lib/data";
import { LearningPath } from "@/types/learning";
import { useChild } from "@/context/ChildContext";
import { PageHeader } from "@/components/PageHeader";
import Tooltip from "react-native-walkthrough-tooltip";
import { getData, storeData, StorageKeys } from "@/lib/storage";

const HeaderBanner: React.FC = React.memo(() => (
  <View className="mx-4 h-40 rounded-2xl overflow-hidden mb-6">
    <Image
      source={{
        uri: "https://dtsjrc96mj.ufs.sh/f/E1OdRdSFWCZS6BqkwwAIkGsqUgazHJ6p5X3rTLuAcBQhx70f",
      }}
      className="w-full h-full"
      resizeMode="cover"
    />
    <View className="absolute bottom-0 left-0 right-0 bg-black/30 p-4">
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
    testID={`learning-path-${path.id}`}
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
  const [showTutorial, setShowTutorial] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    checkFirstTimeUser();
  }, []);

  const checkFirstTimeUser = async () => {
    try {
      const hasSeenTutorial = await getData(
        StorageKeys.HAS_SEEN_LEARNING_TUTORIAL
      );
      if (!hasSeenTutorial) {
        setShowTutorial(true);
        await storeData(StorageKeys.HAS_SEEN_LEARNING_TUTORIAL, true);
      }
    } catch (error) {
      console.error("Error checking tutorial status:", error);
    }
  };

  const handleNextStep = () => {
    if (currentStep < 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setShowTutorial(false);
    }
  };

  const handleSkipTutorial = () => {
    setShowTutorial(false);
  };

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
        title={activeChild ? `${activeChild.name}'s Adventures` : "Adventures"}
        subtitle="Pick a path to start learning!"
      />

      <View className="flex-1">
        <FlatList
          data={learningPaths}
          renderItem={({ item }) => (
            <LearningPathCard path={item} onPress={handlePathPress} />
          )}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 24 }}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={<HeaderBanner />}
          testID="learning-paths-list"
        />

        <Tooltip
          isVisible={showTutorial && currentStep === 0}
          content={
            <View className="p-4">
              <Text className="text-zinc-900 text-base font-bold mb-2">
                Welcome to Learning Adventures! 🎯
              </Text>
              <Text className="text-zinc-900 text-sm mb-4">
                Choose from different learning paths like spelling, numbers, and
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
          <View />
        </Tooltip>

        <Tooltip
          isVisible={showTutorial && currentStep === 1}
          content={
            <View className="p-4">
              <Text className="text-zinc-900 text-base font-bold mb-2">
                Start Your Learning Journey! ✨
              </Text>
              <Text className="text-zinc-900 text-sm mb-4">
                Tap on any learning path to begin. Complete activities to earn
                XP and level up!
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
          <View />
        </Tooltip>
      </View>
    </SafeAreaView>
  );
}
