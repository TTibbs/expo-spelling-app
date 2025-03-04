import React, { useState, useEffect } from "react";
import { useFocusEffect } from "expo-router";
import { useChild } from "@/context/ChildContext";
import { loadUserProfile, getData, StorageKeys } from "@/lib/storage";
import { ChildProfile } from "@/types/common";

export function useProfileData() {
  const { activeChild, isLoading: isChildLoading } = useChild();
  const [profileData, setProfileData] = useState<{ level: string; xp: number }>(
    {
      level: "1",
      xp: 0,
    }
  );

  const fetchUserProfile = async () => {
    try {
      console.log("Fetching user profile...");
      if (activeChild) {
        // Get child profiles from storage
        const childProfiles = await getData(StorageKeys.CHILD_PROFILES);
        console.log("Child profiles:", childProfiles);
        if (childProfiles) {
          const childProfile = childProfiles.find(
            (child: ChildProfile) => child.id === activeChild.id
          );
          console.log("Found child profile:", childProfile);
          if (childProfile) {
            setProfileData({
              level: childProfile.level,
              xp: childProfile.xp,
            });
            return;
          }
        }
      }

      // If no active child or child profile not found, load parent profile
      const profile = await loadUserProfile();
      console.log("Loaded parent profile:", profile);
      setProfileData({
        level: profile.level,
        xp: profile.xp,
      });
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

  // Add a debug effect to log state changes
  useEffect(() => {
    console.log("Profile data state updated:", profileData);
  }, [profileData]);

  return {
    userLevel: profileData.level,
    xp: profileData.xp,
    isLoading: isChildLoading,
    refreshProfile: fetchUserProfile,
  };
}
