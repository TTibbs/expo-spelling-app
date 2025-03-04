import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { LearnedWord } from "@/types/common";

interface WordCardProps {
  word: LearnedWord;
  onPress: (word: LearnedWord) => void;
}

export const WordCard: React.FC<WordCardProps> = React.memo(
  ({ word, onPress }) => (
    <TouchableOpacity
      className="bg-white rounded-xl mb-3 overflow-hidden flex-row shadow-sm"
      onPress={() => onPress(word)}
    >
      <Image source={{ uri: word.image }} className="w-20 h-20" />
      <View className="p-3 flex-1 justify-center">
        <Text className="text-base font-bold text-[#1E293B] mb-1">
          {word.word}
        </Text>
        <Text className="text-sm text-[#6366F1] mb-1 capitalize">
          {word.category}
        </Text>
        <Text className="text-xs text-[#94A3B8]">
          Learned: {new Date(word.learnedAt).toLocaleDateString()}
        </Text>
      </View>
    </TouchableOpacity>
  )
);
