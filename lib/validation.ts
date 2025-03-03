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

    default:
      return null;
  }
}
