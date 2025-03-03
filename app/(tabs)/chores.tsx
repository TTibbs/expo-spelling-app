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
  updateUserXp,
} from "@/lib/storage";

// Import newly created components
import ProfileHeader from "@/components/ProfileHeader";
import CategorySelector from "@/components/CategorySelector";
import ChoreDropdown from "@/components/ChoreDropdown";
import AssignedChoresList from "@/components/AssignedChoresList";
import ChoreActionButtons from "@/components/ChoreActionButtons";

export default function ChoresScreen() {
  const [selectedCategory, setSelectedCategory] = useState<string>("home");
  const [assignedChores, setAssignedChores] = useState<Chore[]>([]);
  const [completionModalVisible, setCompletionModalVisible] =
    useState<boolean>(false);
  const [totalXp, setTotalXp] = useState<number>(0);
  // User profile state
  const [userLevel, setUserLevel] = useState<string>("1");
  const [xp, setXp] = useState<number>(0);

  // Dropdown state
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);

  // Check if all chores are completed
  const allChoresCompleted =
    assignedChores.length > 0 &&
    assignedChores.every((chore) => chore.completed);

  // Feedback message for adding/removing chores
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  // Load user profile data
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        // Use the centralized loadUserProfile function to get a validated profile
        const profile = await loadUserProfile();
        setUserLevel(profile.level);
        setXp(profile.xp);
      } catch (error) {
        console.error(
          "Failed to load user profile:",
          error instanceof Error ? error.message : "Unknown error"
        );
      }
    };

    fetchUserProfile();
  }, []);

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

      // Get existing completed chores
      const existingCompletedChores = await getData(
        StorageKeys.COMPLETED_CHORES
      );

      const updatedCompletedChores = existingCompletedChores
        ? [...existingCompletedChores, ...completedChores]
        : completedChores;

      // Store updated completed chores
      await storeData(StorageKeys.COMPLETED_CHORES, updatedCompletedChores);

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

      // Award XP to user profile
      const updatedProfile = await updateUserXp(xpToAward);

      if (updatedProfile) {
        // Update local state
        setUserLevel(updatedProfile.level);
        setXp(updatedProfile.xp);

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
      <ProfileHeader userLevel={userLevel} xp={xp} />

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
