import React, { useState, useEffect } from "react";
import {
  View,
  Alert,
  Text,
  RefreshControl,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import CategorySelector from "@/components/CategorySelector";
import ChoreDropdown from "@/components/ChoreDropdown";
import AssignedChoresList from "@/components/AssignedChoresList";
import ChoreActionButtons from "@/components/ChoreActionButtons";
import { useChild } from "@/context/ChildContext";
import { Chore, CompletedChore } from "@/types/common";
import { choreCategories, choresByCategory, xpValues } from "@/lib/data";
import { getData, storeData, StorageKeys, updateUserXP } from "@/lib/storage";
import { useProfileData } from "@/hooks/useProfileData";
import { PageHeader } from "@/components/PageHeader";
import Tooltip from "react-native-walkthrough-tooltip";

export default function ChoresScreen() {
  const { activeChild } = useChild();
  const { refreshProfile } = useProfileData();
  const [selectedCategory, setSelectedCategory] = useState<string>("home");
  const [assignedChores, setAssignedChores] = useState<Chore[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);
  const [refreshing, setRefreshing] = React.useState(false);
  const [showTutorial, setShowTutorial] = useState(true);
  const [currentStep, setCurrentStep] = useState(0);

  // Check if all chores are completed
  const allChoresCompleted =
    assignedChores.length > 0 &&
    assignedChores.every((chore) => chore.completed);

  const onRefresh = React.useCallback(async () => {
    try {
      setRefreshing(true);
      console.log("Starting profile refresh...");
      await refreshProfile();
      console.log("Profile refresh completed");
    } catch (error) {
      console.error("Error refreshing profile:", error);
    } finally {
      // Ensure we wait at least 2 seconds for the refresh indicator
      await new Promise((resolve) => setTimeout(resolve, 2000));
      setRefreshing(false);
    }
  }, [refreshProfile]);

  // Clear feedback message after a short delay
  useEffect(() => {
    if (feedbackMessage) {
      const timer = setTimeout(() => setFeedbackMessage(null), 2000);
      return () => clearTimeout(timer);
    }
  }, [feedbackMessage]);

  // Calculate total XP from assigned chores
  const calculateTotalXp = React.useCallback((): number => {
    const baseXp = assignedChores
      .filter((chore) => chore.completed)
      .reduce((sum, chore) => sum + chore.xp, 0);

    const allCompletedBonus = allChoresCompleted
      ? xpValues.completeAllChores
      : 0;
    return baseXp + allCompletedBonus;
  }, [assignedChores, allChoresCompleted]);

  // Add a chore to the assigned list
  const addChore = React.useCallback(
    (chore: Chore): void => {
      const isAlreadyAssigned = assignedChores.some(
        (assigned) => assigned.id === chore.id
      );
      if (!isAlreadyAssigned) {
        setAssignedChores((prevChores) => [
          ...prevChores,
          { ...chore, completed: false },
        ]);
        setFeedbackMessage(`Added: ${chore.title}`);
      }
    },
    [assignedChores]
  );

  // Toggle the completion status of a chore
  const toggleChoreCompletion = React.useCallback((id: string): void => {
    setAssignedChores((prevChores) =>
      prevChores.map((chore) =>
        chore.id === id ? { ...chore, completed: !chore.completed } : chore
      )
    );
  }, []);

  // Remove a chore from the assigned list
  const removeChore = React.useCallback(
    (id: string): void => {
      const choreToRemove = assignedChores.find((chore) => chore.id === id);
      if (choreToRemove) {
        setFeedbackMessage(`Removed: ${choreToRemove.title}`);
      }
      setAssignedChores((prevChores) =>
        prevChores.filter((chore) => chore.id !== id)
      );
    },
    [assignedChores]
  );

  // Save completed chores to history
  const saveCompletedChores = React.useCallback(async (): Promise<boolean> => {
    try {
      const completedChores: CompletedChore[] = assignedChores
        .filter((chore) => chore.completed)
        .map((chore) => ({
          id: chore.id,
          title: chore.title,
          category: selectedCategory,
          xp: chore.xp,
          completedAt: new Date().toISOString(),
        }));

      if (completedChores.length === 0) return false;

      const storageKey = activeChild
        ? StorageKeys.CHILD_COMPLETED_CHORES
        : StorageKeys.COMPLETED_CHORES;
      const existingCompletedChores = await getData(storageKey);
      let updatedCompletedChores:
        | CompletedChore[]
        | { [childId: string]: CompletedChore[] };

      if (activeChild) {
        const childChores =
          (existingCompletedChores as {
            [childId: string]: CompletedChore[];
          }) || {};
        const childExistingChores = childChores[activeChild.id] || [];
        updatedCompletedChores = {
          ...childChores,
          [activeChild.id]: [...childExistingChores, ...completedChores],
        };
      } else {
        const parentChores =
          (existingCompletedChores as CompletedChore[]) || [];
        updatedCompletedChores = [...parentChores, ...completedChores];
      }

      return await storeData(storageKey, updatedCompletedChores);
    } catch (error) {
      console.error(
        "Failed to save completed chores:",
        error instanceof Error ? error.message : "Unknown error"
      );
      return false;
    }
  }, [assignedChores, selectedCategory, activeChild]);

  // Complete all chores and award XP
  const completeAllChores = React.useCallback(async (): Promise<void> => {
    try {
      const xpToAward = calculateTotalXp();
      if (xpToAward <= 0) {
        Alert.alert(
          "No Completed Chores",
          "Complete some chores first to earn XP!"
        );
        return;
      }

      const savedChores = await saveCompletedChores();
      if (!savedChores) {
        Alert.alert(
          "No Completed Chores",
          "Complete some chores first to earn XP!"
        );
        return;
      }

      const updatedProfile = await updateUserXP(xpToAward, activeChild?.id);
      if (updatedProfile) {
        await refreshProfile();
        Alert.alert("Chores Completed!", `You've earned ${xpToAward} XP!`, [
          {
            text: "OK",
            onPress: () => {
              setAssignedChores([]);
            },
          },
        ]);
      }
    } catch (error) {
      console.error("Failed to complete chores:", error);
      Alert.alert("Error", "Failed to complete chores. Please try again.");
    }
  }, [calculateTotalXp, saveCompletedChores, activeChild, refreshProfile]);

  // Reset the assigned chores list
  const resetChores = React.useCallback(async (): Promise<void> => {
    Alert.alert(
      "Reset Chores",
      "Are you sure you want to clear all assigned chores?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Yes",
          onPress: () => {
            setAssignedChores([]);
            setFeedbackMessage("All chores have been reset");
          },
        },
      ]
    );
  }, []);

  const handleSkipTutorial = () => {
    setShowTutorial(false);
    setCurrentStep(currentStep + 1);
  };

  const handleNextStep = () => {
    setShowTutorial(false);
    setCurrentStep(currentStep + 1);
  };

  return (
    <SafeAreaView className="flex-1 bg-[#F9F9F9]">
      <PageHeader
        title={activeChild ? `${activeChild.name}'s Chores` : "My Chores"}
        subtitle="Complete tasks to earn XP!"
      />

      <ScrollView
        className="flex-1"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View className="px-5">
          {showTutorial ? (
            <>
              <Tooltip
                isVisible={currentStep === 0}
                content={
                  <View className="p-4">
                    <Text className="text-zinc-900 text-base font-bold mb-2">
                      Welcome to Chores! 🧹
                    </Text>
                    <Text className="text-zinc-900 text-sm mb-4">
                      Select a category to see available chores. Complete them
                      to earn XP and rewards!
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
                <CategorySelector
                  categories={choreCategories}
                  selectedCategory={selectedCategory}
                  setSelectedCategory={setSelectedCategory}
                />
              </Tooltip>

              <Tooltip
                isVisible={currentStep === 1}
                content={
                  <View className="p-4">
                    <Text className="text-zinc-900 text-base font-bold mb-2">
                      Add Chores to Your List! 📝
                    </Text>
                    <Text className="text-zinc-900 text-sm mb-4">
                      Tap the + button to add chores. Mark them as complete when
                      you're done!
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
                <ChoreDropdown
                  isDropdownOpen={isDropdownOpen}
                  setIsDropdownOpen={setIsDropdownOpen}
                  selectedCategory={selectedCategory}
                  choresByCategory={choresByCategory}
                  assignedChores={assignedChores}
                  addChore={addChore}
                />
              </Tooltip>

              <Tooltip
                isVisible={currentStep === 2}
                content={
                  <View className="p-4">
                    <Text className="text-zinc-900 text-base font-bold mb-2">
                      Complete Chores & Earn Rewards! 🎁
                    </Text>
                    <Text className="text-zinc-900 text-sm mb-4">
                      Mark chores as complete and tap "Complete All" to earn XP.
                      Complete all chores for bonus rewards!
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
                <View className="flex-1">
                  <AssignedChoresList
                    assignedChores={assignedChores}
                    toggleChoreCompletion={toggleChoreCompletion}
                    removeChore={removeChore}
                  />
                  <ChoreActionButtons
                    assignedChores={assignedChores}
                    resetChores={resetChores}
                    completeAllChores={completeAllChores}
                    calculateTotalXp={calculateTotalXp}
                  />
                </View>
              </Tooltip>
            </>
          ) : (
            <>
              <CategorySelector
                categories={choreCategories}
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
              />

              <ChoreDropdown
                isDropdownOpen={isDropdownOpen}
                setIsDropdownOpen={setIsDropdownOpen}
                selectedCategory={selectedCategory}
                choresByCategory={choresByCategory}
                assignedChores={assignedChores}
                addChore={addChore}
              />

              <View className="flex-1">
                <AssignedChoresList
                  assignedChores={assignedChores}
                  toggleChoreCompletion={toggleChoreCompletion}
                  removeChore={removeChore}
                />
                <ChoreActionButtons
                  assignedChores={assignedChores}
                  resetChores={resetChores}
                  completeAllChores={completeAllChores}
                  calculateTotalXp={calculateTotalXp}
                />
              </View>
            </>
          )}
        </View>
      </ScrollView>

      {feedbackMessage && (
        <View className="absolute bottom-5 self-center bg-[#1E293B] px-4 py-2 rounded-full">
          <Text className="text-white">{feedbackMessage}</Text>
        </View>
      )}
    </SafeAreaView>
  );
}
