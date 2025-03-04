import React, { useState, useEffect } from "react";
import { useFocusEffect } from "expo-router";
import { useChild } from "@/context/ChildContext";
import { loadUserProfile, getData, StorageKeys } from "@/lib/storage";
import { ChildProfile } from "@/types/common";

export function useProfileData() {
  const { activeChild, isLoading: isChildLoading } = useChild();
  const [userLevel, setUserLevel] = useState<string>("1");
  const [xp, setXp] = useState<number>(0);

  const fetchUserProfile = async () => {
    try {
      if (activeChild) {
        // Get child profiles from storage
        const childProfiles = await getData(StorageKeys.CHILD_PROFILES);
        if (childProfiles) {
          const childProfile = childProfiles.find(
            (child: ChildProfile) => child.id === activeChild.id
          );
          if (childProfile) {
            setUserLevel(childProfile.level);
            setXp(childProfile.xp);
            return;
          }
        }
      }

      // If no active child or child profile not found, load parent profile
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

  // Load profile data on initial mount and when active child changes
  useEffect(() => {
    fetchUserProfile();
  }, [activeChild]);

  // Refresh profile data when the screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      fetchUserProfile();
    }, [activeChild])
  );

  return {
    userLevel,
    xp,
    isLoading: isChildLoading,
    refreshProfile: fetchUserProfile,
  };
}
