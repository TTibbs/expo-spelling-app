import React, { createContext, useContext, useState, useEffect } from "react";
import { ChildProfile } from "@/types/common";
import { getData, StorageKeys } from "@/lib/storage";

interface ChildContextType {
  activeChild: ChildProfile | null;
  setActiveChild: (child: ChildProfile | null) => void;
  isLoading: boolean;
}

const ChildContext = createContext<ChildContextType | undefined>(undefined);

export function ChildProvider({ children }: { children: React.ReactNode }) {
  const [activeChild, setActiveChild] = useState<ChildProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadActiveChild();
  }, []);

  const loadActiveChild = async () => {
    try {
      // Get child profiles
      const childProfiles = await getData(StorageKeys.CHILD_PROFILES);

      // Get user profile to check if user is a parent
      const userProfile = await getData(StorageKeys.USER_PROFILE);

      if (userProfile?.isParent && childProfiles && childProfiles.length > 0) {
        // Set the first child as active by default
        setActiveChild(childProfiles[0]);
      }
    } catch (error) {
      console.error("Error loading active child:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ChildContext.Provider value={{ activeChild, setActiveChild, isLoading }}>
      {children}
    </ChildContext.Provider>
  );
}

export function useChild() {
  const context = useContext(ChildContext);
  if (context === undefined) {
    throw new Error("useChild must be used within a ChildProvider");
  }
  return context;
}
