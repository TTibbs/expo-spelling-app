import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  Switch,
  TouchableOpacity,
  ScrollView,
  Alert,
  TextInput,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import * as SecureStore from "expo-secure-store";
import PinModal from "@/components/PinModal";
import PinProtection from "@/components/PinProtection";
import { getData, storeData, StorageKeys } from "@/lib/storage";
import { ChildProfile } from "@/types/common";
import { generateUniqueId } from "@/lib/utils";
import { useChild } from "@/context/ChildContext";

const PIN_KEY = "parental_control_pin";

export default function ProtectedSettingsScreen(): JSX.Element {
  const router = useRouter();
  const { activeChild, setActiveChild } = useChild();
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [notifications, setNotifications] = useState<boolean>(true);
  const [isPinSetup, setIsPinSetup] = useState<boolean>(false);
  const [showPinModal, setShowPinModal] = useState<boolean>(false);
  const [childProfiles, setChildProfiles] = useState<ChildProfile[]>([]);
  const [showAddChildModal, setShowAddChildModal] = useState<boolean>(false);
  const [newChildName, setNewChildName] = useState<string>("");

  const handlePinFailure = useCallback(async () => {
    try {
      await storeData(StorageKeys.PIN_VERIFICATION, false);
      router.back();
    } catch (error) {
      console.error("Error clearing PIN verification:", error);
      router.back();
    }
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

  // Clear PIN verification when navigating away
  useEffect(() => {
    return () => {
      storeData(StorageKeys.PIN_VERIFICATION, false).catch((error) => {
        console.error("Error clearing PIN verification:", error);
      });
    };
  }, []);

  useEffect(() => {
    loadChildProfiles();
  }, []);

  const loadChildProfiles = async () => {
    const profiles = await getData(StorageKeys.CHILD_PROFILES);
    if (profiles) {
      setChildProfiles(profiles);
    }
  };

  const handleAddChild = async () => {
    if (!newChildName.trim()) {
      Alert.alert("Error", "Please enter a name for the child");
      return;
    }

    try {
      // Create new child profile
      const newChild: ChildProfile = {
        id: generateUniqueId(),
        name: newChildName.trim(),
        xp: 0,
        level: "1",
        lastPlayed: null,
        createdAt: new Date().toISOString(),
      };

      // Get current child profiles
      const currentProfiles = (await getData(StorageKeys.CHILD_PROFILES)) || [];
      const updatedProfiles = [...currentProfiles, newChild];

      // Save updated child profiles
      await storeData(StorageKeys.CHILD_PROFILES, updatedProfiles);

      // Update user profile to mark as parent if not already
      const userProfile = await getData(StorageKeys.USER_PROFILE);
      if (userProfile && !userProfile.isParent) {
        const updatedUserProfile = {
          ...userProfile,
          isParent: true,
        };
        await storeData(StorageKeys.USER_PROFILE, updatedUserProfile);
      }

      // Set the new child as active if it's the first one
      if (!activeChild) {
        setActiveChild(newChild);
      }

      // Update local state
      setChildProfiles(updatedProfiles);
      setNewChildName("");
      setShowAddChildModal(false);

      Alert.alert("Success", "Child profile added successfully!");
    } catch (error) {
      console.error("Error adding child profile:", error);
      Alert.alert("Error", "Failed to add child profile. Please try again.");
    }
  };

  const handleDeleteChild = async (childId: string) => {
    Alert.alert(
      "Delete Child Profile",
      "Are you sure you want to delete this child's profile? This action cannot be undone.",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              const updatedProfiles = childProfiles.filter(
                (child) => child.id !== childId
              );

              // Update storage
              await storeData(StorageKeys.CHILD_PROFILES, updatedProfiles);

              // Update local state
              setChildProfiles(updatedProfiles);

              // If the deleted child was active, set a new active child
              if (activeChild?.id === childId) {
                if (updatedProfiles.length > 0) {
                  setActiveChild(updatedProfiles[0]);
                } else {
                  setActiveChild(null);
                }
              }
            } catch (error) {
              console.error("Error deleting child profile:", error);
              Alert.alert(
                "Error",
                "Failed to delete child profile. Please try again."
              );
            }
          },
        },
      ]
    );
  };

  const handleSwitchChild = (child: ChildProfile) => {
    setActiveChild(child);
  };

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
      <ScrollView className="flex-1">
        {/* Child Profiles Section */}
        <View className="bg-white rounded-xl mx-5 my-2.5 p-4 shadow-sm">
          <Text className="text-base font-bold text-[#1E293B] mb-4">
            Child Profiles
          </Text>

          {childProfiles.map((child) => (
            <TouchableOpacity
              key={child.id}
              className={`flex-row items-center justify-between py-3 border-b border-[#F1F5F9] ${
                activeChild?.id === child.id ? "bg-[#EEF2FF]" : ""
              }`}
              onPress={() => handleSwitchChild(child)}
            >
              <View className="flex-row items-center">
                <View className="w-9 h-9 rounded-full bg-[#EEF2FF] justify-center items-center mr-3">
                  <Ionicons name="person" size={20} color="#6366F1" />
                </View>
                <View>
                  <Text className="text-base text-[#334155]">{child.name}</Text>
                  <Text className="text-xs text-[#64748B]">
                    Level {child.level} • {child.xp} XP
                  </Text>
                </View>
              </View>
              <TouchableOpacity
                onPress={() => handleDeleteChild(child.id)}
                className="p-2"
              >
                <Ionicons name="trash-outline" size={20} color="#EF4444" />
              </TouchableOpacity>
            </TouchableOpacity>
          ))}

          <TouchableOpacity
            className="flex-row items-center py-3"
            onPress={() => setShowAddChildModal(true)}
          >
            <View className="w-9 h-9 rounded-full bg-[#EEF2FF] justify-center items-center mr-3">
              <Ionicons name="add-circle" size={20} color="#6366F1" />
            </View>
            <Text className="text-base text-[#334155]">Add Child Profile</Text>
          </TouchableOpacity>
        </View>

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

      {/* Add Child Modal */}
      {showAddChildModal && (
        <View className="absolute inset-0 bg-black/50 justify-center items-center">
          <View className="bg-white rounded-xl p-6 w-[80%]">
            <Text className="text-xl font-bold text-[#1E293B] mb-4">
              Add Child Profile
            </Text>
            <TextInput
              className="border border-[#E2E8F0] rounded-lg p-3 mb-4"
              placeholder="Enter child's name"
              value={newChildName}
              onChangeText={setNewChildName}
              autoFocus={true}
              keyboardType="default"
              returnKeyType="done"
              blurOnSubmit={true}
            />
            <View className="flex-row justify-end gap-3">
              <TouchableOpacity
                className="px-4 py-2 rounded-lg bg-[#E2E8F0]"
                onPress={() => {
                  setShowAddChildModal(false);
                  setNewChildName("");
                }}
              >
                <Text className="text-[#64748B]">Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="px-4 py-2 rounded-lg bg-[#6366F1]"
                onPress={handleAddChild}
              >
                <Text className="text-white">Add</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}

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
      setupMode={showPinModal}
    >
      <SettingsContent />
    </PinProtection>
  );
}
