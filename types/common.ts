/**
 * Common types used throughout the application
 */
import type { ComponentProps } from "react";
import Ionicons from "@expo/vector-icons/Ionicons";

/**
 * Type for Ionicons names available in the Ionicons library
 */
export type IconName = ComponentProps<typeof Ionicons>["name"];

/**
 * Difficulty level for activities and challenges
 */
export type Difficulty = "easy" | "medium" | "hard";

/**
 * Base interface for all activities (learning paths, math, shapes)
 */
export interface Activity {
  id: string;
  title: string;
  description: string;
  route: string;
  icon: IconName;
  color: string;
  backgroundColor: string;
  difficulty: Difficulty;
  available: boolean;
}

/**
 * Base statistics for category tracking
 */
export interface CategoryStats {
  attempted: number;
  correct: number;
  accuracy: number;
}

/**
 * Represents a chore that can be assigned and completed
 */
export type Chore = {
  id: string;
  title: string;
  icon: string;
  xp: number;
  completed?: boolean;
};

/**
 * Represents a generic category
 */
export type Category = {
  id: string;
  title: string;
  icon: string;
};

/**
 * Represents a completed chore with timestamp
 */
export type CompletedChore = {
  id: string;
  title: string;
  category: string;
  xp: number;
  completedAt: string;
};

/**
 * Represents a word that has been learned by the user
 */
export type LearnedWord = {
  id: string;
  word: string;
  category: string;
  image: string;
  learnedAt: string;
};

/**
 * Represents a word in the spelling activities
 */
export type Word = {
  id: string;
  word: string;
  image: string;
};

/**
 * Represents a category of words
 */
export type WordCategory = {
  id: string;
  title: string;
  icon: string;
};

/**
 * Represents the user's profile information
 */
export type UserProfile = {
  xp: number;
  level: string;
  lastPlayed: string | null;
};

/**
 * Represents a player level with XP thresholds
 */
export type PlayerLevel = {
  id: string;
  title: string;
  description: string;
  minXp: number;
  maxXp: number;
};

/**
 * Represents the XP values for different actions in the app
 */
export type XPValues = {
  completeWord: number;
  perfectWord: number;
  dailyStreak: number;
  completeChore: number;
  completeAllChores: number;
};
