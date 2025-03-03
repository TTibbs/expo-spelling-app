import React from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { CategorySelectorProps } from "@/types/common";

const CategorySelector: React.FC<CategorySelectorProps> = ({
  categories,
  selectedCategory,
  setSelectedCategory,
}) => {
  return (
    <View className="h-12 mb-2">
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {categories.map((category) => (
          <TouchableOpacity
            key={category.id}
            className={`px-4 py-2 mx-1 rounded-full ${
              category.id === selectedCategory ? "bg-[#6366F1]" : "bg-[#F1F5F9]"
            }`}
            onPress={() => setSelectedCategory(category.id)}
          >
            <View className="flex-row items-center">
              <Ionicons
                name={category.icon as any}
                size={16}
                color={category.id === selectedCategory ? "#FFFFFF" : "#64748B"}
                style={{ marginRight: 4 }}
              />
              <Text
                className={`${
                  category.id === selectedCategory
                    ? "text-white"
                    : "text-[#64748B]"
                } font-medium`}
              >
                {category.title}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

export default CategorySelector;
