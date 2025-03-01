import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  Switch,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import * as SecureStore from "expo-secure-store";
import PinModal from "@/app/components/PinModal";
import PinProtection from "../components/PinProtection";

const PIN_KEY = "parental_control_pin";

export default function ProtectedSettingsScreen(): JSX.Element {
  const router = useRouter();
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [notifications, setNotifications] = useState<boolean>(true);
  const [isPinSetup, setIsPinSetup] = useState<boolean>(false);
  const [showPinModal, setShowPinModal] = useState<boolean>(false);

  const handlePinFailure = useCallback(() => {
    // Navigate back if PIN verification is cancelled or failed
    router.back();
  }, [router]);

  useEffect(() => {
    // Check if PIN is already setup
    const checkPin = async () => {
      try {
        const pin = await SecureStore.getItemAsync(PIN_KEY);
        setIsPinSetup(!!pin);
      } catch (error) {
        console.error("Error checking PIN:", error);
      }
    };

    checkPin();
  }, []);

  const handlePinModalSuccess = () => {
    setShowPinModal(false);
    // Refresh PIN status
    const checkPin = async () => {
      try {
        const pin = await SecureStore.getItemAsync(PIN_KEY);
        setIsPinSetup(!!pin);
        Alert.alert("Success", "PIN has been updated");
      } catch (error) {
        console.error("Error checking PIN:", error);
      }
    };
    checkPin();
  };

  const handleResetPin = async () => {
    Alert.alert(
      "Reset PIN",
      "Are you sure you want to reset your parental PIN?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Reset",
          style: "destructive",
          onPress: async () => {
            try {
              await SecureStore.deleteItemAsync(PIN_KEY);
              setIsPinSetup(false);
              Alert.alert("Success", "PIN has been reset");
            } catch (error) {
              console.error("Error resetting PIN:", error);
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  const SettingsContent = () => (
    <SafeAreaView className="flex-1 bg-[#F9F9F9]">
      <View className="px-5 pt-5 pb-4 flex-row justify-between items-center">
        <View className="flex-row items-center gap-2">
          <TouchableOpacity onPress={() => router.back()} className="mr-2">
            <Ionicons name="arrow-back" size={24} color="#1E293B" />
          </TouchableOpacity>
          <Text className="text-2xl font-bold text-[#1E293B]">Settings</Text>
        </View>
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

        {/* Parental Controls Section */}
        <View className="bg-white rounded-xl mx-5 my-2.5 p-4 shadow-sm">
          <Text className="text-base font-bold text-[#1E293B] mb-4">
            Parental Controls
          </Text>

          <TouchableOpacity
            className="py-3 border-b border-[#F1F5F9]"
            onPress={() => setShowPinModal(true)}
          >
            <View className="flex-row items-center">
              <View className="w-9 h-9 rounded-full bg-[#EEF2FF] justify-center items-center mr-3">
                <Ionicons name="lock-closed" size={20} color="#6366F1" />
              </View>
              <View className="flex-1">
                <Text className="text-base text-[#334155]">
                  {isPinSetup ? "Change PIN" : "Set Up PIN"}
                </Text>
                <Text className="text-xs text-[#64748B]">
                  {isPinSetup
                    ? "Update your parental access PIN"
                    : "Create a PIN to protect settings"}
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#94A3B8" />
            </View>
          </TouchableOpacity>

          {isPinSetup && (
            <TouchableOpacity
              className="py-3 border-b border-[#F1F5F9]"
              onPress={handleResetPin}
            >
              <View className="flex-row items-center">
                <View className="w-9 h-9 rounded-full bg-[#FECACA] justify-center items-center mr-3">
                  <Ionicons name="trash-outline" size={20} color="#EF4444" />
                </View>
                <View className="flex-1">
                  <Text className="text-base text-[#334155]">Reset PIN</Text>
                  <Text className="text-xs text-[#64748B]">
                    Remove the current parental access PIN
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#94A3B8" />
              </View>
            </TouchableOpacity>
          )}
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

      <PinModal
        isVisible={showPinModal}
        onClose={() => setShowPinModal(false)}
        onSuccess={handlePinModalSuccess}
        setupMode={!isPinSetup}
      />
    </SafeAreaView>
  );

  return (
    <PinProtection
      isProtected={true}
      onAccessGranted={() => {}}
      onAccessDenied={handlePinFailure}
    >
      <SettingsContent />
    </PinProtection>
  );
}
