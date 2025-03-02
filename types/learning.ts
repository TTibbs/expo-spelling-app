import type { ComponentProps } from "react";
import Ionicons from "@expo/vector-icons/Ionicons";

/**
 * Type for Ionicons names to be used in learning paths
 */
export type IconName = ComponentProps<typeof Ionicons>["name"];

/**
 * Interface for learning paths displayed on the main learning screen
 */
export interface LearningPath {
  id: string;
  title: string;
  description: string;
  icon: IconName;
  iconColor: string;
  backgroundColor: string;
  route: string; // Where this learning path should navigate to
  available: boolean;
}
