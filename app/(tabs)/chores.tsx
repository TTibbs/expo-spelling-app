import { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Alert,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import {
  choreCategories,
  choresByCategory,
  xpValues,
  playerLevels,
} from "@/lib/data";
import { Chore, CompletedChore, UserProfile } from "@/types/common";
import { getData, storeData, StorageKeys } from "@/lib/storage";

export default function ChoresScreen() {
  const router = useRouter();
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

  // Calculate total XP earned
  const calculateTotalXp = (): number => {
    const choreXp = assignedChores.reduce((sum, chore) => sum + chore.xp, 0);
    const bonusXp = assignedChores.length > 0 ? xpValues.completeAllChores : 0;
    return choreXp + bonusXp;
  };

  // Add a chore to the assigned list
  const addChore = (chore: Chore): void => {
    // Check if chore is already assigned
    if (assignedChores.some((c) => c.id === chore.id)) {
      // Remove the chore if it's already in the list (toggle functionality)
      setAssignedChores(assignedChores.filter((c) => c.id !== chore.id));
      // Show feedback message
      setFeedbackMessage(`"${chore.title}" removed from your list`);
      return;
    }

    setAssignedChores([...assignedChores, { ...chore, completed: false }]);
    // Show feedback message
    setFeedbackMessage(`"${chore.title}" added to your list`);
    // Keep dropdown open after selection to allow multiple selections
  };

  // Toggle chore completion status
  const toggleChoreCompletion = (id: string): void => {
    setAssignedChores(
      assignedChores.map((chore) =>
        chore.id === id ? { ...chore, completed: !chore.completed } : chore
      )
    );
  };

  // Remove a chore from the assigned list
  const removeChore = (id: string): void => {
    setAssignedChores(assignedChores.filter((chore) => chore.id !== id));
  };

  // Update user XP using type-safe storage
  const updateUserXp = async (xpToAdd: number): Promise<UserProfile | null> => {
    try {
      // Get current user profile
      const userProfile = (await getData(StorageKeys.USER_PROFILE)) || {
        xp: 0,
        level: "1",
        lastPlayed: null,
      };

      // Add XP
      userProfile.xp += xpToAdd;
      userProfile.lastPlayed = new Date().toISOString();

      // Calculate level based on XP
      for (const level of playerLevels) {
        if (userProfile.xp >= level.minXp && userProfile.xp < level.maxXp) {
          userProfile.level = level.id;
          break;
        }
      }

      // Save updated profile
      await storeData(StorageKeys.USER_PROFILE, userProfile);

      console.log(
        `Updated user profile: XP +${xpToAdd}, Total: ${userProfile.xp}, Level: ${userProfile.level}`
      );
      return userProfile;
    } catch (error) {
      console.error(
        "Failed to update user XP:",
        error instanceof Error ? error.message : "Unknown error"
      );
      return null;
    }
  };

  // Save completed chores to history
  const saveCompletedChores = async (): Promise<boolean> => {
    try {
      // Get current chore history using type-safe storage
      const completedChoresData =
        (await getData(StorageKeys.COMPLETED_CHORES)) || [];

      // Add the new completed chores
      const newCompletedChores: CompletedChore[] = assignedChores.map(
        (chore) => ({
          id: chore.id,
          title: chore.title,
          category: selectedCategory,
          xp: chore.xp,
          completedAt: new Date().toISOString(),
        })
      );

      const updatedCompletedChores = [
        ...completedChoresData,
        ...newCompletedChores,
      ];

      // Save back to storage
      await storeData(StorageKeys.COMPLETED_CHORES, updatedCompletedChores);

      console.log(
        `Saved ${newCompletedChores.length} completed chores to history`
      );
      return true;
    } catch (error) {
      console.error(
        "Failed to save completed chores:",
        error instanceof Error ? error.message : "Unknown error"
      );
      return false;
    }
  };

  // Complete all chores and show modal
  const completeAllChores = async (): Promise<void> => {
    if (assignedChores.length === 0) {
      Alert.alert("No Chores", "Add some chores to your list first!");
      return;
    }

    if (!allChoresCompleted) {
      Alert.alert(
        "Incomplete Chores",
        "Complete all chores before submitting!"
      );
      return;
    }

    const calculatedXp = calculateTotalXp();
    setTotalXp(calculatedXp);

    try {
      // Save completed chores to history
      await saveCompletedChores();

      // Update user XP
      await updateUserXp(calculatedXp);

      // Show completion modal
      setCompletionModalVisible(true);
    } catch (error) {
      console.error("Error completing chores:", error);
      Alert.alert(
        "Error",
        "There was a problem saving your progress. Please try again."
      );
    }
  };

  // Reset chores after completion
  const resetChores = async (): Promise<void> => {
    setAssignedChores([]);
    setCompletionModalVisible(false);
  };

  // Render the dropdown button
  const renderDropdownButton = (): JSX.Element => {
    return (
      <TouchableOpacity
        className="w-full h-12 bg-[#EEF2FF] rounded-xl flex-row items-center px-4 justify-between"
        onPress={() => setIsDropdownOpen(!isDropdownOpen)}
      >
        <Text className="text-[#1E293B] font-medium">
          {isDropdownOpen ? "Select a chore" : "Add a new chore"}
        </Text>
        <Ionicons
          name={isDropdownOpen ? "chevron-up" : "chevron-down"}
          size={24}
          color="#6366F1"
        />
      </TouchableOpacity>
    );
  };

  // Render assigned chore item
  const renderAssignedChoreItem = ({ item }: { item: Chore }): JSX.Element => (
    <View className="flex-row items-center p-4 bg-white rounded-xl mb-2 shadow-sm">
      <TouchableOpacity
        className="w-10 h-10 bg-[#EEF2FF] rounded-full items-center justify-center mr-3"
        onPress={() => toggleChoreCompletion(item.id)}
      >
        <Ionicons
          name={item.completed ? "checkmark-circle" : "ellipse-outline"}
          size={24}
          color={item.completed ? "#10B981" : "#6366F1"}
        />
      </TouchableOpacity>
      <View className="flex-1">
        <Text
          className={`${
            item.completed ? "text-[#64748B] line-through" : "text-[#1E293B]"
          } font-medium`}
        >
          {item.title}
        </Text>
        <Text className="text-[#64748B] text-xs">{item.xp} XP</Text>
      </View>
      <TouchableOpacity onPress={() => removeChore(item.id)}>
        <Ionicons name="trash-outline" size={20} color="#EF4444" />
      </TouchableOpacity>
    </View>
  );

  // Render category selector in dropdown
  const renderCategorySelector = (): JSX.Element => (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      className="mb-4"
    >
      {choreCategories.map((category) => (
        <TouchableOpacity
          key={category.id}
          className={`px-4 py-2 mx-1 rounded-full ${
            selectedCategory === category.id ? "bg-[#6366F1]" : "bg-[#F1F5F9]"
          }`}
          onPress={() => setSelectedCategory(category.id)}
        >
          <Text
            className={`${
              selectedCategory === category.id ? "text-white" : "text-[#64748B]"
            } font-medium`}
          >
            {category.icon} {category.title}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );

  // Render chore items in dropdown
  const renderChoreItems = (): JSX.Element => {
    const chores =
      choresByCategory[selectedCategory as keyof typeof choresByCategory] || [];

    return (
      <View className="max-h-60 bg-white rounded-xl shadow-md mb-4">
        <ScrollView className="p-2">
          {chores.map((chore) => {
            const isAlreadyAssigned = assignedChores.some(
              (c) => c.id === chore.id
            );

            return (
              <TouchableOpacity
                key={chore.id}
                className={`flex-row items-center p-3 rounded-lg mb-1 ${
                  isAlreadyAssigned ? "bg-[#F0F9FF]" : "bg-[#F9FAFB]"
                }`}
                onPress={() => !isAlreadyAssigned && addChore(chore)}
                disabled={isAlreadyAssigned}
              >
                <View className="w-8 h-8 bg-[#EEF2FF] rounded-full items-center justify-center mr-3">
                  <Ionicons
                    name={chore.icon as any}
                    size={16}
                    color="#6366F1"
                  />
                </View>
                <View className="flex-1">
                  <Text className="text-[#1E293B] font-medium">
                    {chore.title}
                  </Text>
                  <Text className="text-[#64748B] text-xs">
                    Earn {chore.xp} XP
                  </Text>
                </View>
                {isAlreadyAssigned ? (
                  <Ionicons name="checkmark-circle" size={20} color="#10B981" />
                ) : (
                  <Ionicons
                    name="add-circle-outline"
                    size={20}
                    color="#6366F1"
                  />
                )}
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-[#F9F9F9]">
      {/* Header section */}
      <View className="flex-row justify-between items-center px-5 pt-5 pb-4">
        <Text className="text-2xl font-bold text-[#1E293B]">My Chores</Text>
      </View>

      {/* Main content */}
      <View className="flex-1 px-5">
        {/* Dropdown for selecting chores */}
        <View className="mb-4">
          {renderDropdownButton()}

          {isDropdownOpen && (
            <View className="mt-2">
              {renderCategorySelector()}
              {renderChoreItems()}

              {/* Feedback message */}
              {feedbackMessage && (
                <View className="bg-[#EEF2FF] p-3 rounded-lg mb-2 border border-[#6366F1]">
                  <Text className="text-[#6366F1] text-center font-medium">
                    {feedbackMessage}
                  </Text>
                </View>
              )}

              {/* Close dropdown button */}
              <TouchableOpacity
                className="py-3 bg-[#F1F5F9] rounded-xl items-center mb-1"
                onPress={() => setIsDropdownOpen(false)}
              >
                <Text className="text-[#64748B] font-medium">
                  Done Selecting
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Assigned chores section */}
        <View className="flex-row justify-between items-center mb-4">
          <Text className="text-lg font-bold text-[#1E293B]">
            Assigned Chores
          </Text>
          <Text className="text-sm text-[#64748B]">
            {assignedChores.filter((c) => c.completed).length}/
            {assignedChores.length} completed
          </Text>
        </View>

        {assignedChores.length === 0 ? (
          <View className="flex-1 justify-center items-center">
            <Ionicons name="list-outline" size={60} color="#CBD5E1" />
            <Text className="text-[#64748B] mt-4 text-center">
              No chores assigned yet.{"\n"}Use the dropdown above to add chores.
            </Text>
          </View>
        ) : (
          <FlatList
            data={assignedChores}
            renderItem={renderAssignedChoreItem}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 80 }}
          />
        )}

        {/* Complete button */}
        <View className="absolute bottom-5 left-5 right-5">
          <TouchableOpacity
            className={`py-4 rounded-xl items-center ${
              allChoresCompleted ? "bg-[#6366F1]" : "bg-[#CBD5E1]"
            }`}
            onPress={completeAllChores}
            disabled={!allChoresCompleted}
          >
            <Text className="text-white font-bold">Complete All Chores</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Completion Modal */}
      {completionModalVisible && (
        <View className="absolute inset-0 justify-center items-center bg-black/50">
          <View className="bg-white rounded-xl p-6 w-[90%] max-w-[350px] items-center">
            <View className="w-20 h-20 bg-[#EEF2FF] rounded-full items-center justify-center mb-4">
              <Ionicons name="trophy" size={40} color="#6366F1" />
            </View>

            <Text className="text-xl font-bold text-[#1E293B] mb-2">
              Great Job!
            </Text>

            <Text className="text-[#64748B] text-center mb-4">
              You've completed all your chores and earned:
            </Text>

            <View className="bg-[#EEF2FF] w-full rounded-xl p-4 mb-6 items-center">
              <Text className="text-2xl font-bold text-[#6366F1]">
                +{totalXp} XP
              </Text>
              <Text className="text-[#64748B] text-xs">
                {assignedChores.length} chores + bonus XP
              </Text>
            </View>

            <View className="flex-row w-full">
              <TouchableOpacity
                className="flex-1 py-3 bg-[#F1F5F9] rounded-xl mr-2 items-center"
                onPress={async () => {
                  await resetChores();
                  router.push("/");
                }}
              >
                <Text className="text-[#64748B] font-medium">Home</Text>
              </TouchableOpacity>

              <TouchableOpacity
                className="flex-1 py-3 bg-[#6366F1] rounded-xl ml-2 items-center"
                onPress={async () => {
                  await resetChores();
                  router.push("/profile");
                }}
              >
                <Text className="text-white font-medium">Profile</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}
