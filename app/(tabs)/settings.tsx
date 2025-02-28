import { View, Text, Switch, TouchableOpacity, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState } from "react";
import Ionicons from "@expo/vector-icons/Ionicons";

export default function SettingsScreen() {
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);

  return (
    <SafeAreaView className="flex-1 bg-[#F9F9F9]">
      <View className="px-5 pt-5 pb-4">
        <Text className="text-2xl font-bold text-[#1E293B]">Settings</Text>
      </View>

      <ScrollView className="flex-1">
        <View className="bg-white rounded-xl mx-5 my-2.5 p-4 shadow-sm">
          <Text className="text-base font-bold text-[#1E293B] mb-4">
            Preferences
          </Text>

          <View className="flex-row justify-between items-center py-3 border-b border-[#F1F5F9]">
            <View className="flex-row items-center">
              <View className="w-9 h-9 rounded-full bg-[#EEF2FF] justify-center items-center mr-3">
                <Ionicons name="volume-high" size={20} color="#6366F1" />
              </View>
              <Text className="text-base text-[#334155]">Sound Effects</Text>
            </View>
            <Switch
              value={soundEnabled}
              onValueChange={setSoundEnabled}
              trackColor={{ false: "#CBD5E1", true: "#A5B4FC" }}
              thumbColor={soundEnabled ? "#6366F1" : "#F1F5F9"}
            />
          </View>

          <View className="flex-row justify-between items-center py-3 border-b border-[#F1F5F9]">
            <View className="flex-row items-center">
              <View className="w-9 h-9 rounded-full bg-[#EEF2FF] justify-center items-center mr-3">
                <Ionicons name="moon" size={20} color="#6366F1" />
              </View>
              <Text className="text-base text-[#334155]">Dark Mode</Text>
            </View>
            <Switch
              value={darkMode}
              onValueChange={setDarkMode}
              trackColor={{ false: "#CBD5E1", true: "#A5B4FC" }}
              thumbColor={darkMode ? "#6366F1" : "#F1F5F9"}
            />
          </View>

          <View className="flex-row justify-between items-center py-3 border-b border-[#F1F5F9]">
            <View className="flex-row items-center">
              <View className="w-9 h-9 rounded-full bg-[#EEF2FF] justify-center items-center mr-3">
                <Ionicons
                  name="notifications-outline"
                  size={20}
                  color="#6366F1"
                />
              </View>
              <Text className="text-base text-[#334155]">Notifications</Text>
            </View>
            <Switch
              value={notifications}
              onValueChange={setNotifications}
              trackColor={{ false: "#CBD5E1", true: "#A5B4FC" }}
              thumbColor={notifications ? "#6366F1" : "#F1F5F9"}
            />
          </View>
        </View>

        <View className="bg-white rounded-xl mx-5 my-2.5 p-4 shadow-sm">
          <Text className="text-base font-bold text-[#1E293B] mb-4">
            Support
          </Text>

          <TouchableOpacity className="py-3 border-b border-[#F1F5F9]">
            <View className="flex-row items-center">
              <View className="w-9 h-9 rounded-full bg-[#EEF2FF] justify-center items-center mr-3">
                <Ionicons name="help-circle" size={20} color="#6366F1" />
              </View>
              <Text className="text-base text-[#334155]">Help & FAQ</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity className="py-3 border-b border-[#F1F5F9]">
            <View className="flex-row items-center">
              <View className="w-9 h-9 rounded-full bg-[#EEF2FF] justify-center items-center mr-3">
                <Ionicons name="information-circle" size={20} color="#6366F1" />
              </View>
              <Text className="text-base text-[#334155]">About</Text>
            </View>
          </TouchableOpacity>
        </View>

        <View className="items-center my-7">
          <Text className="text-sm text-[#94A3B8]">SpellMaster v1.0.0</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
