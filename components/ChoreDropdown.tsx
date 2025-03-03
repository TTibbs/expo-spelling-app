import React from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Chore, ChoreDropdownProps } from "@/types/common";

const ChoreDropdown: React.FC<ChoreDropdownProps> = ({
  isDropdownOpen,
  setIsDropdownOpen,
  selectedCategory,
  choresByCategory,
  assignedChores,
  addChore,
}) => {
  // Render dropdown button for chore category selection
  const renderDropdownButton = (): JSX.Element => {
    return (
      <TouchableOpacity
        className="bg-white rounded-lg p-3 flex-row items-center justify-between shadow-sm"
        onPress={() => setIsDropdownOpen(!isDropdownOpen)}
      >
        <View className="flex-row items-center">
          <Text className="text-base font-medium text-[#1E293B]">
            {isDropdownOpen ? "Select Chores to Add" : "Add Chores"}
          </Text>
        </View>
        <Ionicons
          name={isDropdownOpen ? "chevron-up" : "chevron-down"}
          size={20}
          color="#64748B"
        />
      </TouchableOpacity>
    );
  };

  // Render chore items from selected category
  const renderChoreItems = (): JSX.Element => {
    const chores = choresByCategory[selectedCategory] || [];

    return (
      <View className="bg-white rounded-lg p-3 mb-2 shadow-sm">
        <ScrollView className="max-h-[180px]">
          {chores.map((chore: Chore) => {
            const isAlreadyAssigned = assignedChores.some(
              (assignedChore) => assignedChore.id === chore.id
            );

            return (
              <TouchableOpacity
                key={chore.id}
                className={`flex-row items-center p-2 rounded-lg mb-1 ${
                  isAlreadyAssigned ? "bg-[#F0F9FF]" : "bg-[#F9FAFB]"
                }`}
                onPress={() => !isAlreadyAssigned && addChore(chore)}
                disabled={isAlreadyAssigned}
              >
                <View className="w-7 h-7 bg-[#EEF2FF] rounded-full items-center justify-center mr-2">
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
    <View className="mb-2">
      {renderDropdownButton()}
      {isDropdownOpen && renderChoreItems()}
    </View>
  );
};

export default ChoreDropdown;
