import { useState, useEffect } from "react";
import { View, Alert, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { choreCategories, choresByCategory, xpValues } from "@/lib/data";
import { Chore, CompletedChore } from "@/types/common";
import {
  getData,
  storeData,
  StorageKeys,
  loadUserProfile,
  updateUserXP,
} from "@/lib/storage";
import { useChild } from "@/context/ChildContext";
import { useProfileData } from "@/hooks/useProfileData";

// Import newly created components
import ProfileHeader from "@/components/ProfileHeader";
import CategorySelector from "@/components/CategorySelector";
import ChoreDropdown from "@/components/ChoreDropdown";
import AssignedChoresList from "@/components/AssignedChoresList";
import ChoreActionButtons from "@/components/ChoreActionButtons";

export default function ChoresScreen() {
  const { activeChild, isLoading: isChildLoading } = useChild();
  const { refreshProfile } = useProfileData();
  const [selectedCategory, setSelectedCategory] = useState<string>("home");
  const [assignedChores, setAssignedChores] = useState<Chore[]>([]);
  const [completionModalVisible, setCompletionModalVisible] =
    useState<boolean>(false);
  const [totalXp, setTotalXp] = useState<number>(0);

  // Dropdown state
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);

  // Check if all chores are completed
  const allChoresCompleted =
    assignedChores.length > 0 &&
    assignedChores.every((chore) => chore.completed);

  // Feedback message for adding/removing chores
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  // Clear feedback message after a short delay
  useEffect(() => {
    if (feedbackMessage) {
      const timer = setTimeout(() => {
        setFeedbackMessage(null);
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [feedbackMessage]);

  // Calculate total XP from assigned chores
  const calculateTotalXp = (): number => {
    const baseXp = assignedChores
      .filter((chore) => chore.completed)
      .reduce((sum, chore) => sum + chore.xp, 0);

    const allCompletedBonus = allChoresCompleted
      ? xpValues.completeAllChores
      : 0;

    return baseXp + allCompletedBonus;
  };

  // Add a chore to the assigned list
  const addChore = (chore: Chore): void => {
    // Check if already assigned - this shouldn't happen with the disabled state,
    // but as a safeguard let's check anyway
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

    // The dropdown intentionally stays open to allow adding multiple chores
  };

  // Toggle the completion status of a chore
  const toggleChoreCompletion = (id: string): void => {
    setAssignedChores((prevChores) =>
      prevChores.map((chore) =>
        chore.id === id ? { ...chore, completed: !chore.completed } : chore
      )
    );
  };

  // Remove a chore from the assigned list
  const removeChore = (id: string): void => {
    const choreToRemove = assignedChores.find((chore) => chore.id === id);
    if (choreToRemove) {
      setFeedbackMessage(`Removed: ${choreToRemove.title}`);
    }

    setAssignedChores((prevChores) =>
      prevChores.filter((chore) => chore.id !== id)
    );
  };

  // Save completed chores to history
  const saveCompletedChores = async (): Promise<boolean> => {
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

      if (completedChores.length === 0) {
        return false;
      }

      // Get existing completed chores based on whether we're in child mode
      const storageKey = activeChild
        ? StorageKeys.CHILD_COMPLETED_CHORES
        : StorageKeys.COMPLETED_CHORES;

      const existingCompletedChores = await getData(storageKey);
      let updatedCompletedChores:
        | CompletedChore[]
        | { [childId: string]: CompletedChore[] };

      if (activeChild) {
        // For child mode, we need to handle the child-specific structure
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
        // For parent mode, use the simple array structure
        const parentChores =
          (existingCompletedChores as CompletedChore[]) || [];
        updatedCompletedChores = [...parentChores, ...completedChores];
      }

      // Store updated completed chores
      await storeData(storageKey, updatedCompletedChores);

      return true;
    } catch (error) {
      console.error(
        "Failed to save completed chores:",
        error instanceof Error ? error.message : "Unknown error"
      );
      return false;
    }
  };

  // Complete all chores and award XP
  const completeAllChores = async (): Promise<void> => {
    try {
      // Calculate XP to award
      const xpToAward = calculateTotalXp();

      if (xpToAward <= 0) {
        Alert.alert(
          "No Completed Chores",
          "Complete some chores first to earn XP!"
        );
        return;
      }

      // Save completed chores to history
      const savedChores = await saveCompletedChores();

      if (!savedChores) {
        Alert.alert(
          "No Completed Chores",
          "Complete some chores first to earn XP!"
        );
        return;
      }

      // Award XP to user profile, passing childId if in child mode
      const updatedProfile = await updateUserXP(xpToAward, activeChild?.id);

      if (updatedProfile) {
        // Refresh profile data to show updated XP and level
        await refreshProfile();

        // Show success message
        Alert.alert("Chores Completed!", `You've earned ${xpToAward} XP!`, [
          {
            text: "OK",
            onPress: () => {
              // Reset assigned chores
              setAssignedChores([]);
              setTotalXp(0);
            },
          },
        ]);
      }
    } catch (error) {
      console.error("Failed to complete chores:", error);
      Alert.alert("Error", "Failed to complete chores. Please try again.");
    }
  };

  // Reset the assigned chores list
  const resetChores = async (): Promise<void> => {
    Alert.alert(
      "Reset Chores",
      "Are you sure you want to clear all assigned chores?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Yes",
          onPress: () => {
            setAssignedChores([]);
            setTotalXp(0);
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-[#F9F9F9]">
      {/* Header section */}
      <ProfileHeader />

      {/* Main content */}
      <View className="flex-1 px-5 pt-1">
        {/* Category selector */}
        <CategorySelector
          categories={choreCategories}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
        />

        {/* Dropdown for selecting chores */}
        <ChoreDropdown
          isDropdownOpen={isDropdownOpen}
          setIsDropdownOpen={setIsDropdownOpen}
          selectedCategory={selectedCategory}
          choresByCategory={choresByCategory}
          assignedChores={assignedChores}
          addChore={addChore}
        />

        {/* Assigned chores list - now wrapped in a flex-1 container for proper scrolling */}
        <View className="flex-1">
          <AssignedChoresList
            assignedChores={assignedChores}
            toggleChoreCompletion={toggleChoreCompletion}
            removeChore={removeChore}
          />
        </View>

        {/* Action buttons */}
        <ChoreActionButtons
          assignedChores={assignedChores}
          resetChores={resetChores}
          completeAllChores={completeAllChores}
          calculateTotalXp={calculateTotalXp}
        />

        {/* Feedback message */}
        {feedbackMessage && (
          <View className="absolute bottom-5 self-center bg-[#1E293B] px-4 py-2 rounded-full">
            <Text className="text-white">{feedbackMessage}</Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}
