import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Chore, AssignedChoresListProps } from "@/types/common";

const AssignedChoresList: React.FC<AssignedChoresListProps> = ({
  assignedChores,
  toggleChoreCompletion,
  removeChore,
}) => {
  // Render an assigned chore item
  const renderAssignedChoreItem = (item: Chore): JSX.Element => (
    <View className="bg-white mb-3 rounded-lg overflow-hidden shadow-sm">
      <View className="flex-row items-center p-4">
        <TouchableOpacity
          className="mr-3"
          onPress={() => toggleChoreCompletion(item.id)}
        >
          <View
            className={`w-6 h-6 rounded-full items-center justify-center border ${
              item.completed
                ? "bg-[#10B981] border-[#10B981]"
                : "border-[#CBD5E1]"
            }`}
          >
            {item.completed && (
              <Ionicons name="checkmark" size={16} color="white" />
            )}
          </View>
        </TouchableOpacity>
        <View className="flex-1">
          <Text
            className={`font-medium ${
              item.completed ? "text-[#94A3B8] line-through" : "text-[#1E293B]"
            }`}
          >
            {item.title}
          </Text>
          <Text className="text-xs text-[#64748B]">{item.xp} XP</Text>
        </View>
        <TouchableOpacity className="p-2" onPress={() => removeChore(item.id)}>
          <Ionicons name="trash-outline" size={20} color="#EF4444" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View className="mb-2 flex-1">
      <Text className="text-lg font-semibold text-[#1E293B] mb-1">
        Assigned Chores
      </Text>
      {assignedChores.length === 0 ? (
        <View className="bg-white p-3 rounded-lg shadow-sm items-center">
          <Text className="text-[#64748B] text-center">
            No chores assigned yet. Add some chores from the dropdown above.
          </Text>
        </View>
      ) : (
        <View>
          {assignedChores.map((item) => (
            <View key={item.id}>{renderAssignedChoreItem(item)}</View>
          ))}
        </View>
      )}
    </View>
  );
};

export default AssignedChoresList;
