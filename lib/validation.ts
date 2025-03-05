/**
 * Type validation utilities
 * These utilities help validate data at runtime to ensure type safety
 * when working with external data sources like AsyncStorage or API responses
 */

import {
  Word,
  WordCategory,
  UserProfile,
  LearnedWord,
  Difficulty,
  CompletedChore,
  ChildProfile,
  RewardProgress,
} from "@/types/common";
import { WordProgress, SpellingStats } from "@/types/spelling";
import { MathStats } from "@/types/numbers";
import { ShapeStats, ShapeCategoryStats } from "@/types/shapes";

// Define storage keys enum to avoid circular import
export enum ValidationStorageKeys {
  LEARNED_WORDS = "learnedWords",
  USER_PROFILE = "userProfile",
  WORD_PROGRESS = "wordProgress",
  SPELLING_STATS = "spellingStats",
  MATH_STATS = "mathStats",
  SHAPE_STATS = "shapeStats",
  PIN_ATTEMPTS = "pinAttempts",
  THEME_SETTINGS = "themeSettings",
  SOUND_SETTINGS = "soundSettings",
  COMPLETED_CHORES = "completedChores",
  CHILD_PROFILES = "childProfiles",
  CHILD_LEARNED_WORDS = "childLearnedWords",
  CHILD_MATH_STATS = "childMathStats",
  CHILD_SHAPE_STATS = "childShapeStats",
  CHILD_COMPLETED_CHORES = "childCompletedChores",
  PIN_VERIFICATION = "pinVerification",
  REWARD_PROGRESS = "rewardProgress",
  CHILD_REWARD_PROGRESS = "childRewardProgress",
  HAS_SEEN_TUTORIAL = "hasSeenTutorial",
  HAS_SEEN_LEARNING_TUTORIAL = "hasSeenLearningTutorial",
}

// Define storage data interface to avoid circular import
export interface ValidationStorageData {
  [ValidationStorageKeys.LEARNED_WORDS]: LearnedWord[];
  [ValidationStorageKeys.USER_PROFILE]: UserProfile;
  [ValidationStorageKeys.WORD_PROGRESS]: WordProgress[];
  [ValidationStorageKeys.SPELLING_STATS]: SpellingStats;
  [ValidationStorageKeys.MATH_STATS]: MathStats;
  [ValidationStorageKeys.SHAPE_STATS]: ShapeStats;
  [ValidationStorageKeys.PIN_ATTEMPTS]: number;
  [ValidationStorageKeys.THEME_SETTINGS]: { darkMode: boolean };
  [ValidationStorageKeys.SOUND_SETTINGS]: { enabled: boolean; volume: number };
  [ValidationStorageKeys.COMPLETED_CHORES]: CompletedChore[];
  [ValidationStorageKeys.CHILD_PROFILES]: ChildProfile[];
  [ValidationStorageKeys.CHILD_LEARNED_WORDS]: {
    [childId: string]: LearnedWord[];
  };
  [ValidationStorageKeys.CHILD_MATH_STATS]: { [childId: string]: MathStats };
  [ValidationStorageKeys.CHILD_SHAPE_STATS]: { [childId: string]: ShapeStats };
  [ValidationStorageKeys.CHILD_COMPLETED_CHORES]: {
    [childId: string]: CompletedChore[];
  };
  [ValidationStorageKeys.PIN_VERIFICATION]: boolean;
  [ValidationStorageKeys.REWARD_PROGRESS]: RewardProgress;
  [ValidationStorageKeys.CHILD_REWARD_PROGRESS]: {
    [childId: string]: RewardProgress;
  };
  [ValidationStorageKeys.HAS_SEEN_TUTORIAL]: boolean;
  [ValidationStorageKeys.HAS_SEEN_LEARNING_TUTORIAL]: boolean;
}

/**
 * Type guard for Word
 */
export function isWord(data: unknown): data is Word {
  return (
    typeof data === "object" &&
    data !== null &&
    "id" in data &&
    "word" in data &&
    "image" in data &&
    typeof (data as Word).id === "string" &&
    typeof (data as Word).word === "string" &&
    typeof (data as Word).image === "string"
  );
}

/**
 * Type guard for WordCategory
 */
export function isWordCategory(data: unknown): data is WordCategory {
  return (
    typeof data === "object" &&
    data !== null &&
    "id" in data &&
    "title" in data &&
    "icon" in data &&
    typeof (data as WordCategory).id === "string" &&
    typeof (data as WordCategory).title === "string" &&
    typeof (data as WordCategory).icon === "string"
  );
}

/**
 * Type guard for UserProfile
 */
export function isUserProfile(data: unknown): data is UserProfile {
  return (
    typeof data === "object" &&
    data !== null &&
    "xp" in data &&
    "level" in data &&
    typeof (data as UserProfile).xp === "number" &&
    typeof (data as UserProfile).level === "string"
  );
}

/**
 * Type guard for LearnedWord
 */
export function isLearnedWord(data: unknown): data is LearnedWord {
  return (
    isWord(data) &&
    "category" in data &&
    "learnedAt" in data &&
    typeof (data as LearnedWord).category === "string" &&
    typeof (data as LearnedWord).learnedAt === "string"
  );
}

/**
 * Type guard for WordProgress
 */
export function isWordProgress(data: unknown): data is WordProgress {
  return (
    typeof data === "object" &&
    data !== null &&
    "wordId" in data &&
    "attempts" in data &&
    "mastered" in data &&
    "lastAttempt" in data &&
    typeof (data as WordProgress).wordId === "string" &&
    typeof (data as WordProgress).attempts === "number" &&
    typeof (data as WordProgress).mastered === "boolean" &&
    typeof (data as WordProgress).lastAttempt === "string"
  );
}

/**
 * Type guard for Difficulty
 */
export function isDifficulty(value: unknown): value is Difficulty {
  return (
    typeof value === "string" &&
    (value === "easy" || value === "medium" || value === "hard")
  );
}

/**
 * Type guard for SpellingStats
 */
export function isSpellingStats(data: unknown): data is SpellingStats {
  if (
    typeof data !== "object" ||
    data === null ||
    !("totalAttempts" in data) ||
    !("correctAttempts" in data) ||
    !("accuracy" in data) ||
    !("streak" in data) ||
    !("highestStreak" in data) ||
    !("wordsLearned" in data) ||
    !("categories" in data)
  ) {
    return false;
  }

  // Check if all properties have correct types
  const stats = data as SpellingStats;
  return (
    typeof stats.totalAttempts === "number" &&
    typeof stats.correctAttempts === "number" &&
    typeof stats.accuracy === "number" &&
    typeof stats.streak === "number" &&
    typeof stats.highestStreak === "number" &&
    typeof stats.wordsLearned === "number" &&
    typeof stats.categories === "object"
  );
}

/**
 * Type guard for MathStats
 */
export function isMathStats(data: unknown): data is MathStats {
  if (
    typeof data !== "object" ||
    data === null ||
    !("totalProblems" in data) ||
    !("correctAnswers" in data) ||
    !("streak" in data) ||
    !("highestStreak" in data) ||
    !("addition" in data) ||
    !("subtraction" in data) ||
    !("counting" in data)
  ) {
    return false;
  }

  // Check if basic properties have correct types
  const stats = data as MathStats;
  return (
    typeof stats.totalProblems === "number" &&
    typeof stats.correctAnswers === "number" &&
    typeof stats.streak === "number" &&
    typeof stats.highestStreak === "number" &&
    typeof stats.addition === "object" &&
    typeof stats.subtraction === "object" &&
    typeof stats.counting === "object"
  );
}

/**
 * Type guard for ShapeCategoryStats
 * @param data Data to check
 * @returns Whether the data is a valid ShapeCategoryStats object
 */
export function isShapeCategoryStats(
  data: unknown
): data is ShapeCategoryStats {
  return (
    typeof data === "object" &&
    data !== null &&
    "completed" in data &&
    typeof (data as ShapeCategoryStats).completed === "number" &&
    "accuracy" in data &&
    typeof (data as ShapeCategoryStats).accuracy === "number" &&
    // correct is optional in ShapeCategoryStats
    (!("correct" in data) ||
      typeof (data as ShapeCategoryStats).correct === "number")
  );
}

/**
 * Type guard for ShapeStats
 * @param data Data to check
 * @returns Whether the data is a valid ShapeStats object
 */
export function isShapeStats(data: unknown): data is ShapeStats {
  if (typeof data !== "object" || data === null) return false;

  const stats = data as ShapeStats;

  return (
    "totalShapes" in stats &&
    typeof stats.totalShapes === "number" &&
    "circles" in stats &&
    isShapeCategoryStats(stats.circles) &&
    "squares" in stats &&
    isShapeCategoryStats(stats.squares) &&
    "triangles" in stats &&
    isShapeCategoryStats(stats.triangles)
  );
}

/**
 * Type guard for CompletedChore
 * @param data Data to check
 * @returns Whether the data is a valid CompletedChore
 */
export function isCompletedChore(data: unknown): data is CompletedChore {
  return (
    typeof data === "object" &&
    data !== null &&
    "id" in data &&
    typeof (data as CompletedChore).id === "string" &&
    "title" in data &&
    typeof (data as CompletedChore).title === "string" &&
    "category" in data &&
    typeof (data as CompletedChore).category === "string" &&
    "xp" in data &&
    typeof (data as CompletedChore).xp === "number" &&
    "completedAt" in data &&
    typeof (data as CompletedChore).completedAt === "string"
  );
}

/**
 * Type guard for ChildProfile
 */
export function isChildProfile(data: unknown): data is ChildProfile {
  return (
    typeof data === "object" &&
    data !== null &&
    "id" in data &&
    "name" in data &&
    "xp" in data &&
    "level" in data &&
    "createdAt" in data &&
    typeof (data as ChildProfile).id === "string" &&
    typeof (data as ChildProfile).name === "string" &&
    typeof (data as ChildProfile).xp === "number" &&
    typeof (data as ChildProfile).level === "string" &&
    typeof (data as ChildProfile).createdAt === "string"
  );
}

/**
 * Type guard for RewardProgress
 */
export function isRewardProgress(data: unknown): data is RewardProgress {
  if (
    typeof data !== "object" ||
    data === null ||
    !("userId" in data) ||
    !("rewards" in data) ||
    !("dailyProgress" in data) ||
    !("weeklyProgress" in data)
  ) {
    return false;
  }

  const progress = data as RewardProgress;

  // Check daily progress
  if (
    typeof progress.dailyProgress !== "object" ||
    !("date" in progress.dailyProgress) ||
    !("points" in progress.dailyProgress) ||
    !("completed" in progress.dailyProgress) ||
    !Array.isArray(progress.dailyProgress.completed)
  ) {
    return false;
  }

  // Check weekly progress
  if (
    typeof progress.weeklyProgress !== "object" ||
    !("weekStart" in progress.weeklyProgress) ||
    !("points" in progress.weeklyProgress) ||
    !("completed" in progress.weeklyProgress) ||
    !Array.isArray(progress.weeklyProgress.completed)
  ) {
    return false;
  }

  // Check rewards object structure
  if (typeof progress.rewards !== "object") return false;

  // Validate each reward entry
  return Object.values(progress.rewards).every(
    (reward) =>
      typeof reward === "object" &&
      reward !== null &&
      "isCompleted" in reward &&
      typeof reward.isCompleted === "boolean" &&
      "progress" in reward &&
      typeof reward.progress === "number" &&
      "requirements" in reward &&
      typeof reward.requirements === "object"
  );
}

/**
 * Validate data from storage based on key
 * @param key Storage key
 * @param data Data to validate
 * @returns Validated data or null if invalid
 */
export function validateStorageData<K extends keyof ValidationStorageData>(
  key: K,
  data: unknown
): ValidationStorageData[K] | null {
  switch (key) {
    case ValidationStorageKeys.LEARNED_WORDS:
      return Array.isArray(data) && data.every(isLearnedWord)
        ? (data as ValidationStorageData[K])
        : null;

    case ValidationStorageKeys.USER_PROFILE:
      return isUserProfile(data) ? (data as ValidationStorageData[K]) : null;

    case ValidationStorageKeys.WORD_PROGRESS:
      return Array.isArray(data) && data.every(isWordProgress)
        ? (data as ValidationStorageData[K])
        : null;

    case ValidationStorageKeys.SPELLING_STATS:
      return isSpellingStats(data) ? (data as ValidationStorageData[K]) : null;

    case ValidationStorageKeys.MATH_STATS:
      return isMathStats(data) ? (data as ValidationStorageData[K]) : null;

    case ValidationStorageKeys.SHAPE_STATS:
      return isShapeStats(data) ? (data as ValidationStorageData[K]) : null;

    case ValidationStorageKeys.PIN_ATTEMPTS:
      return typeof data === "number"
        ? (data as ValidationStorageData[K])
        : null;

    case ValidationStorageKeys.THEME_SETTINGS:
      return typeof data === "object" &&
        data !== null &&
        "darkMode" in data &&
        typeof (data as any).darkMode === "boolean"
        ? (data as ValidationStorageData[K])
        : null;

    case ValidationStorageKeys.SOUND_SETTINGS:
      return typeof data === "object" &&
        data !== null &&
        "enabled" in data &&
        "volume" in data &&
        typeof (data as any).enabled === "boolean" &&
        typeof (data as any).volume === "number"
        ? (data as ValidationStorageData[K])
        : null;

    case ValidationStorageKeys.COMPLETED_CHORES:
      return Array.isArray(data) && data.every(isCompletedChore)
        ? (data as ValidationStorageData[K])
        : null;

    case ValidationStorageKeys.CHILD_PROFILES:
      return Array.isArray(data) && data.every(isChildProfile)
        ? (data as ValidationStorageData[K])
        : null;

    case ValidationStorageKeys.CHILD_LEARNED_WORDS:
      return typeof data === "object" &&
        data !== null &&
        Object.values(data).every(
          (childWords) =>
            Array.isArray(childWords) && childWords.every(isLearnedWord)
        )
        ? (data as ValidationStorageData[K])
        : null;

    case ValidationStorageKeys.CHILD_MATH_STATS:
      return typeof data === "object" &&
        data !== null &&
        Object.values(data).every(
          (childStats) =>
            typeof childStats === "object" && isMathStats(childStats)
        )
        ? (data as ValidationStorageData[K])
        : null;

    case ValidationStorageKeys.CHILD_SHAPE_STATS:
      return typeof data === "object" &&
        data !== null &&
        Object.values(data).every(
          (childStats) =>
            typeof childStats === "object" && isShapeStats(childStats)
        )
        ? (data as ValidationStorageData[K])
        : null;

    case ValidationStorageKeys.CHILD_COMPLETED_CHORES:
      return typeof data === "object" &&
        data !== null &&
        Object.values(data).every(
          (childChores) =>
            Array.isArray(childChores) && childChores.every(isCompletedChore)
        )
        ? (data as ValidationStorageData[K])
        : null;

    case ValidationStorageKeys.PIN_VERIFICATION:
      return typeof data === "boolean"
        ? (data as ValidationStorageData[K])
        : null;

    case ValidationStorageKeys.REWARD_PROGRESS:
      return isRewardProgress(data) ? (data as ValidationStorageData[K]) : null;

    case ValidationStorageKeys.CHILD_REWARD_PROGRESS:
      return typeof data === "object" &&
        data !== null &&
        Object.values(data).every(
          (childProgress) =>
            typeof childProgress === "object" && isRewardProgress(childProgress)
        )
        ? (data as ValidationStorageData[K])
        : null;

    case ValidationStorageKeys.HAS_SEEN_TUTORIAL:
      return typeof data === "boolean"
        ? (data as ValidationStorageData[K])
        : null;

    case ValidationStorageKeys.HAS_SEEN_LEARNING_TUTORIAL:
      return typeof data === "boolean"
        ? (data as ValidationStorageData[K])
        : null;

    default:
      const exhaustiveCheck: never = key;
      throw new Error(`Unhandled validation key: ${exhaustiveCheck}`);
  }
}
