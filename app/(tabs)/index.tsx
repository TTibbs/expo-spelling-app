import React from "react";
import { View, Text, Image, TouchableOpacity, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";

export default function HomeScreen(): JSX.Element {
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-[#F9F9F9]">
      <ScrollView className="pb-[30px]">
        <View className="px-5 pt-5 pb-2.5">
          <Text className="text-3xl font-bold text-[#1E293B]">SpellMaster</Text>
          <Text className="text-base text-[#64748B] mt-1.5">
            Learn spelling the fun way!
          </Text>
        </View>

        <View className="mx-5 my-4 rounded-2xl overflow-hidden h-[200px]">
          <Image
            source={{
              uri: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=1000&auto=format&fit=crop",
            }}
            className="w-full h-full"
            resizeMode="cover"
          />
          <View className="absolute bottom-0 left-0 right-0 bg-black/50 p-5">
            <Text className="text-white text-lg font-bold mb-2.5">
              Start your spelling adventure!
            </Text>
            <TouchableOpacity
              className="bg-[#6366F1] py-2.5 px-5 rounded-lg self-start"
              onPress={() => router.push("/words")}
            >
              <Text className="text-white font-bold">Play Now</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View className="p-5">
          <Text className="text-xl font-bold text-[#1E293B] mb-4">
            How It Works
          </Text>

          <View className="bg-white rounded-xl p-4 mb-3 flex-row items-center shadow-sm">
            <View className="w-12 h-12 rounded-full bg-[#EEF2FF] justify-center items-center mr-4">
              <Ionicons name="book-outline" color="#6366F1" size={24} />
            </View>
            <View className="flex-1">
              <Text className="text-base font-bold text-[#1E293B] mb-1">
                Choose a Word
              </Text>
              <Text className="text-sm text-[#64748B] leading-5">
                Select from our collection of words to practice your spelling
                skills.
              </Text>
            </View>
          </View>

          <View className="bg-white rounded-xl p-4 mb-3 flex-row items-center shadow-sm">
            <View className="w-12 h-12 rounded-full bg-[#EEF2FF] justify-center items-center mr-4">
              <Ionicons name="bulb-outline" color="#6366F1" size={24} />
            </View>
            <View className="flex-1">
              <Text className="text-base font-bold text-[#1E293B] mb-1">
                Guess Letters
              </Text>
              <Text className="text-sm text-[#64748B] leading-5">
                Tap letters to reveal the hidden word, hangman-style.
              </Text>
            </View>
          </View>

          <View className="bg-white rounded-xl p-4 mb-3 flex-row items-center shadow-sm">
            <View className="w-12 h-12 rounded-full bg-[#EEF2FF] justify-center items-center mr-4">
              <Ionicons name="trophy-outline" color="#6366F1" size={24} />
            </View>
            <View className="flex-1">
              <Text className="text-base font-bold text-[#1E293B] mb-1">
                Learn & Improve
              </Text>
              <Text className="text-sm text-[#64748B] leading-5">
                Build your vocabulary and spelling skills with each game.
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
