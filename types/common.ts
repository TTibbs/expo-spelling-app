/**
 * Common types used throughout the application
 */
import type { ComponentProps, ReactNode, ErrorInfo } from "react";
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
 * Color type for consistent color usage across the app
 */
export type AppColor = string;

/**
 * Base interface for all activities (learning paths, math, shapes)
 */
export interface Activity {
  id: string;
  title: string;
  description?: string;
  route: string;
  icon: IconName;
  color: AppColor;
  backgroundColor: AppColor;
  difficulty: Difficulty;
  available: boolean;
  metadata?: Record<string, unknown>;
}

/**
 * Base statistics for category tracking
 */
export interface CategoryStats {
  attempted: number;
  correct: number;
  accuracy: number;
  lastAttempted?: string;
  streak?: number;
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
  assignedAt?: string;
  completedAt?: string;
  category: string;
  description?: string;
  difficulty?: Difficulty;
  recurring?: boolean;
  recurringSchedule?: {
    frequency: "daily" | "weekly" | "monthly";
    days?: number[];
  };
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
 * Represents a child's profile information
 */
export type ChildProfile = {
  id: string;
  name: string;
  avatar?: string;
  xp: number;
  level: string;
  lastPlayed: string | null;
  createdAt: string;
};

/**
 * Represents the user's profile information
 */
export type UserProfile = {
  id: string;
  name: string;
  avatar?: string;
  xp: number;
  level: string;
  lastPlayed: string | null;
  isParent: boolean;
  children?: ChildProfile[];
  createdAt: string;
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

export interface LevelProgressBarProps {
  currentLevel: PlayerLevel;
  nextLevel?: PlayerLevel;
  currentXP: number;
}

/**
 * Represents the XP values for different actions in the app
 */
export type XPValues = {
  completeWord: number;
  perfectWord: number;
  dailyStreak: number;
  completeChore: number;
  completeAllChores: number;
  fiveLetterWord: number;
  tenLetterWord: number;
  hintPenalty: number;
};

/**
 * Component Props Interfaces
 */

export interface AssignedChoresListProps {
  assignedChores: Chore[];
  toggleChoreCompletion: (id: string) => void;
  removeChore: (id: string) => void;
  testID?: string;
}

export interface CategorySelectorProps {
  categories: Category[];
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  testID?: string;
}

export interface ChoreActionButtonsProps {
  assignedChores: Chore[];
  resetChores: () => Promise<void>;
  completeAllChores: () => Promise<void>;
  calculateTotalXp: () => number;
  testID?: string;
}

export interface ChoreDropdownProps {
  isDropdownOpen: boolean;
  setIsDropdownOpen: (isOpen: boolean) => void;
  selectedCategory: string;
  choresByCategory: Record<string, Chore[]>;
  assignedChores: Chore[];
  addChore: (chore: Chore) => void;
  testID?: string;
}

export interface ProfileHeaderProps {
  userLevel: string;
  xp: number;
}

export interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

export interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export interface PinModalProps {
  isVisible: boolean;
  onClose: () => void;
  onSuccess: () => void;
  setupMode?: boolean;
}

export interface PinProtectionProps {
  children: ReactNode;
  isProtected: boolean;
  onAccessGranted?: () => void;
  onAccessDenied?: () => void;
  setupMode?: boolean;
}

/**
 * Props for the DifficultyBadge component
 */
export interface DifficultyBadgeProps {
  difficulty: Difficulty;
}

/**
 * Represents a reward that can be earned
 */
export type Reward = {
  id: string;
  title: string;
  description: string;
  points: number;
  icon: IconName;
  color: AppColor;
  type: "daily" | "achievement" | "special";
  requirements: RewardRequirement[];
  isLocked: boolean;
  completedAt?: string;
  progress?: number;
};

/**
 * Represents a requirement for earning a reward
 */
export type RewardRequirement = {
  type:
    | "word_challenges"
    | "math_problems"
    | "shapes"
    | "streak"
    | "xp"
    | "time";
  target: number;
  current: number;
  activity?: string;
  timeframe?: "daily" | "weekly" | "monthly" | "all_time";
};

/**
 * Represents the user's reward progress
 */
export type RewardProgress = {
  userId: string;
  rewards: {
    [rewardId: string]: {
      isCompleted: boolean;
      progress: number;
      completedAt?: string;
      requirements: {
        [requirementType: string]: {
          current: number;
          updatedAt: string;
        };
      };
    };
  };
  dailyProgress: {
    date: string;
    points: number;
    completed: string[];
  };
  weeklyProgress: {
    weekStart: string;
    points: number;
    completed: string[];
  };
};
