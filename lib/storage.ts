import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  Word,
  LearnedWord,
  UserProfile,
  CompletedChore,
  ChildProfile,
  RewardProgress,
  Reward,
  RewardRequirement,
} from "@/types/common";
import { MathStats } from "@/types/numbers";
import { ShapeStats } from "@/types/shapes";
import {
  validateStorageData,
  ValidationStorageKeys,
  ValidationStorageData,
} from "@/lib/validation";
import { playerLevels, rewards } from "@/lib/data";
import { initializeRewardProgress, getWeekStart } from "@/lib/utils";

/**
 * Storage keys used throughout the app
 */
export enum StorageKeys {
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

/**
 * Type definition for storage operations
 */
export interface StorageData {
  [StorageKeys.LEARNED_WORDS]: ValidationStorageData[ValidationStorageKeys.LEARNED_WORDS];
  [StorageKeys.USER_PROFILE]: ValidationStorageData[ValidationStorageKeys.USER_PROFILE];
  [StorageKeys.WORD_PROGRESS]: ValidationStorageData[ValidationStorageKeys.WORD_PROGRESS];
  [StorageKeys.SPELLING_STATS]: ValidationStorageData[ValidationStorageKeys.SPELLING_STATS];
  [StorageKeys.MATH_STATS]: MathStats;
  [StorageKeys.SHAPE_STATS]: ShapeStats;
  [StorageKeys.PIN_ATTEMPTS]: number;
  [StorageKeys.THEME_SETTINGS]: { darkMode: boolean };
  [StorageKeys.SOUND_SETTINGS]: { enabled: boolean; volume: number };
  [StorageKeys.COMPLETED_CHORES]: CompletedChore[];
  [StorageKeys.CHILD_PROFILES]: ChildProfile[];
  [StorageKeys.CHILD_LEARNED_WORDS]: { [childId: string]: LearnedWord[] };
  [StorageKeys.CHILD_MATH_STATS]: { [childId: string]: MathStats };
  [StorageKeys.CHILD_SHAPE_STATS]: { [childId: string]: ShapeStats };
  [StorageKeys.CHILD_COMPLETED_CHORES]: { [childId: string]: CompletedChore[] };
  [StorageKeys.PIN_VERIFICATION]: boolean;
  [StorageKeys.REWARD_PROGRESS]: RewardProgress;
  [StorageKeys.CHILD_REWARD_PROGRESS]: { [childId: string]: RewardProgress };
  [StorageKeys.HAS_SEEN_TUTORIAL]: boolean;
  [StorageKeys.HAS_SEEN_LEARNING_TUTORIAL]: boolean;
}

/**
 * Map our storage keys to validation storage keys
 * @param key Storage key
 * @returns Corresponding validation storage key
 */
const storageKeyToValidationKey = (key: StorageKeys): ValidationStorageKeys => {
  switch (key) {
    case StorageKeys.LEARNED_WORDS:
      return ValidationStorageKeys.LEARNED_WORDS;
    case StorageKeys.USER_PROFILE:
      return ValidationStorageKeys.USER_PROFILE;
    case StorageKeys.WORD_PROGRESS:
      return ValidationStorageKeys.WORD_PROGRESS;
    case StorageKeys.SPELLING_STATS:
      return ValidationStorageKeys.SPELLING_STATS;
    case StorageKeys.MATH_STATS:
      return ValidationStorageKeys.MATH_STATS;
    case StorageKeys.SHAPE_STATS:
      return ValidationStorageKeys.SHAPE_STATS;
    case StorageKeys.PIN_ATTEMPTS:
      return ValidationStorageKeys.PIN_ATTEMPTS;
    case StorageKeys.THEME_SETTINGS:
      return ValidationStorageKeys.THEME_SETTINGS;
    case StorageKeys.SOUND_SETTINGS:
      return ValidationStorageKeys.SOUND_SETTINGS;
    case StorageKeys.COMPLETED_CHORES:
      return ValidationStorageKeys.COMPLETED_CHORES;
    case StorageKeys.CHILD_PROFILES:
      return ValidationStorageKeys.CHILD_PROFILES;
    case StorageKeys.CHILD_LEARNED_WORDS:
      return ValidationStorageKeys.CHILD_LEARNED_WORDS;
    case StorageKeys.CHILD_MATH_STATS:
      return ValidationStorageKeys.CHILD_MATH_STATS;
    case StorageKeys.CHILD_SHAPE_STATS:
      return ValidationStorageKeys.CHILD_SHAPE_STATS;
    case StorageKeys.CHILD_COMPLETED_CHORES:
      return ValidationStorageKeys.CHILD_COMPLETED_CHORES;
    case StorageKeys.PIN_VERIFICATION:
      return ValidationStorageKeys.PIN_VERIFICATION;
    case StorageKeys.REWARD_PROGRESS:
      return ValidationStorageKeys.REWARD_PROGRESS;
    case StorageKeys.CHILD_REWARD_PROGRESS:
      return ValidationStorageKeys.CHILD_REWARD_PROGRESS;
    case StorageKeys.HAS_SEEN_TUTORIAL:
      return ValidationStorageKeys.HAS_SEEN_TUTORIAL;
    case StorageKeys.HAS_SEEN_LEARNING_TUTORIAL:
      return ValidationStorageKeys.HAS_SEEN_LEARNING_TUTORIAL;
    default:
      const exhaustiveCheck: never = key;
      throw new Error(`Unhandled storage key: ${exhaustiveCheck}`);
  }
};

/**
 * Get data from AsyncStorage with type safety
 * @param key Storage key
 * @returns Typed data or null if not found or invalid
 */
export async function getData<K extends keyof StorageData>(
  key: K
): Promise<StorageData[K] | null> {
  try {
    const value = await AsyncStorage.getItem(key);
    if (value === null) {
      return null;
    }

    // Parse JSON and validate the data structure
    const parsedData = JSON.parse(value);
    const validationKey = storageKeyToValidationKey(key);
    const validatedData = validateStorageData(validationKey, parsedData);

    if (validatedData === null) {
      console.warn(`Invalid data structure for key: ${key}`);
      return null;
    }

    return validatedData as StorageData[K];
  } catch (error) {
    console.error(`Error retrieving or parsing ${key} from storage:`, error);
    return null;
  }
}

/**
 * Save data to AsyncStorage with type safety
 * @param key Storage key to save data to
 * @param value Data to store, must match the type for the key
 * @returns Promise<boolean> indicating success or failure
 */
export async function storeData<K extends keyof StorageData>(
  key: K,
  value: StorageData[K]
): Promise<boolean> {
  try {
    const jsonValue = JSON.stringify(value);
    await AsyncStorage.setItem(key, jsonValue);
    return true;
  } catch (error) {
    console.error(`Error storing data for key ${key}:`, error);
    return false;
  }
}

/**
 * Remove data from AsyncStorage
 * @param key Storage key to remove
 * @returns Promise<boolean> indicating success or failure
 */
export async function removeData(key: keyof StorageData): Promise<boolean> {
  try {
    await AsyncStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error(`Error removing data for key ${key}:`, error);
    return false;
  }
}

/**
 * Get learned word status for a specific child or user
 * @param wordId Word ID to check
 * @param category Word category
 * @param childId Optional child ID to check for
 * @returns Promise<boolean> indicating if the word is learned
 */
export async function isWordLearned(
  wordId: string,
  category: string,
  childId?: string
): Promise<boolean> {
  try {
    if (childId) {
      // Check child-specific learned words
      const childLearnedWords = await getData(StorageKeys.CHILD_LEARNED_WORDS);
      if (!childLearnedWords) return false;

      const childWords = childLearnedWords[childId] || [];
      return childWords.some(
        (word) => word.id === wordId && word.category === category
      );
    } else {
      // Check user's learned words
      const learnedWords = await getData(StorageKeys.LEARNED_WORDS);
      if (!learnedWords) return false;

      return learnedWords.some(
        (word) => word.id === wordId && word.category === category
      );
    }
  } catch (error) {
    console.error("Error checking if word is learned:", error);
    return false;
  }
}

/**
 * Save a learned word for a specific child or user
 * @param word Word object to save
 * @param category Word category
 * @param childId Optional child ID to save for
 * @returns Promise<boolean> indicating success or failure
 */
export async function saveLearnedWord(
  word: Word,
  category: string,
  childId?: string
): Promise<boolean> {
  try {
    if (childId) {
      // Save to child-specific learned words
      const childLearnedWords =
        (await getData(StorageKeys.CHILD_LEARNED_WORDS)) || {};
      const childWords = childLearnedWords[childId] || [];

      // Check if word is already learned
      const wordExists = childWords.some(
        (w) => w.id === word.id && w.category === category
      );

      if (wordExists) return true;

      // Add the new word
      const newLearnedWord: LearnedWord = {
        id: word.id,
        word: word.word,
        category,
        image: word.image,
        learnedAt: new Date().toISOString(),
      };

      childWords.push(newLearnedWord);
      childLearnedWords[childId] = childWords;
      return await storeData(
        StorageKeys.CHILD_LEARNED_WORDS,
        childLearnedWords
      );
    } else {
      // Save to user's learned words
      const learnedWords = (await getData(StorageKeys.LEARNED_WORDS)) || [];

      // Check if word is already learned
      const wordExists = learnedWords.some(
        (w) => w.id === word.id && w.category === category
      );

      if (wordExists) return true;

      // Add the new word
      const newLearnedWord: LearnedWord = {
        id: word.id,
        word: word.word,
        category,
        image: word.image,
        learnedAt: new Date().toISOString(),
      };

      learnedWords.push(newLearnedWord);
      return await storeData(StorageKeys.LEARNED_WORDS, learnedWords);
    }
  } catch (error) {
    console.error("Error saving learned word:", error);
    return false;
  }
}

/**
 * Update XP for a specific child or user
 * @param xpToAdd Amount of XP to add
 * @param childId Optional child ID to update XP for
 * @returns Promise with updated profile or null on failure
 */
export async function updateUserXP(
  xpToAdd: number,
  childId?: string
): Promise<UserProfile | ChildProfile | null> {
  try {
    if (childId) {
      // Update child profile XP
      const childProfiles = await getData(StorageKeys.CHILD_PROFILES);
      if (!childProfiles) return null;

      const childIndex = childProfiles.findIndex(
        (child) => child.id === childId
      );
      if (childIndex === -1) return null;

      const updatedChild: ChildProfile = {
        ...childProfiles[childIndex],
        xp: Math.max(0, childProfiles[childIndex].xp + xpToAdd),
        lastPlayed: new Date().toISOString(),
      };

      // Find the appropriate level based on XP
      for (const level of playerLevels) {
        if (updatedChild.xp >= level.minXp && updatedChild.xp < level.maxXp) {
          updatedChild.level = level.id;
          break;
        }
      }

      // Handle case where XP exceeds the highest level
      if (updatedChild.xp >= playerLevels[playerLevels.length - 1].maxXp) {
        updatedChild.level = playerLevels[playerLevels.length - 1].id;
      }

      // Update the child's profile in the array
      childProfiles[childIndex] = updatedChild;
      await storeData(StorageKeys.CHILD_PROFILES, childProfiles);

      return updatedChild;
    } else {
      // Update user profile XP
      const userProfile = await loadUserProfile();
      const updatedProfile: UserProfile = {
        ...userProfile,
        xp: Math.max(0, userProfile.xp + xpToAdd),
        lastPlayed: new Date().toISOString(),
      };

      // Find the appropriate level based on XP
      for (const level of playerLevels) {
        if (
          updatedProfile.xp >= level.minXp &&
          updatedProfile.xp < level.maxXp
        ) {
          updatedProfile.level = level.id;
          break;
        }
      }

      // Handle case where XP exceeds the highest level
      if (updatedProfile.xp >= playerLevels[playerLevels.length - 1].maxXp) {
        updatedProfile.level = playerLevels[playerLevels.length - 1].id;
      }

      const success = await storeData(StorageKeys.USER_PROFILE, updatedProfile);
      return success ? updatedProfile : null;
    }
  } catch (error) {
    console.error("Error updating XP:", error);
    return null;
  }
}

/**
 * Load and validate user profile, ensuring the level is correct based on XP
 * @returns Promise with validated user profile
 */
export async function loadUserProfile(): Promise<UserProfile> {
  try {
    console.log("Loading user profile from storage...");
    // Get user profile from storage
    const userProfile = await getData(StorageKeys.USER_PROFILE);
    console.log("Raw user profile from storage:", userProfile);

    if (userProfile) {
      // Validate profile by ensuring level is correct for current XP
      const updatedProfile = { ...userProfile };

      // Find the appropriate level based on XP
      for (const level of playerLevels) {
        if (
          updatedProfile.xp >= level.minXp &&
          updatedProfile.xp < level.maxXp
        ) {
          updatedProfile.level = level.id;
          break;
        }
      }

      // Handle case where XP exceeds the highest level
      if (updatedProfile.xp >= playerLevels[playerLevels.length - 1].maxXp) {
        updatedProfile.level = playerLevels[playerLevels.length - 1].id;
      }

      // If level was updated, save the profile back to storage
      if (updatedProfile.level !== userProfile.level) {
        console.log(
          "Updating profile level from",
          userProfile.level,
          "to",
          updatedProfile.level
        );
        await storeData(StorageKeys.USER_PROFILE, updatedProfile);
      }

      console.log("Returning updated profile:", updatedProfile);
      return updatedProfile;
    } else {
      console.log("No profile found, creating default profile");
      // Create a default profile if none exists
      const defaultProfile: UserProfile = {
        id: "default",
        name: "Default User",
        xp: 0,
        level: "1",
        lastPlayed: new Date().toISOString(),
        isParent: false,
        createdAt: new Date().toISOString(),
      };

      // Save the default profile
      await storeData(StorageKeys.USER_PROFILE, defaultProfile);
      return defaultProfile;
    }
  } catch (error) {
    console.error("Failed to load user profile:", error);
    // Return a default profile in case of error
    return {
      id: "default",
      name: "Default User",
      xp: 0,
      level: "1",
      lastPlayed: null,
      isParent: false,
      createdAt: new Date().toISOString(),
    };
  }
}

/**
 * Get math stats for a specific child or user
 * @param childId Optional child ID to get stats for
 * @returns Promise with math stats
 */
export async function getMathStats(childId?: string): Promise<MathStats> {
  try {
    if (childId) {
      const childMathStats = await getData(StorageKeys.CHILD_MATH_STATS);
      if (childMathStats && childMathStats[childId]) {
        return childMathStats[childId];
      }
    } else {
      const mathStats = await getData(StorageKeys.MATH_STATS);
      if (mathStats) {
        return mathStats;
      }
    }

    // Return default stats if none found
    return {
      totalProblems: 0,
      correctAnswers: 0,
      streak: 0,
      highestStreak: 0,
      addition: {
        attempted: 0,
        correct: 0,
        accuracy: 0,
        timeSpent: 0,
        averageTime: 0,
        highestScore: 0,
        perfectScores: 0,
        hintsUsed: 0,
        strategies: {},
      },
      subtraction: {
        attempted: 0,
        correct: 0,
        accuracy: 0,
        timeSpent: 0,
        averageTime: 0,
        highestScore: 0,
        perfectScores: 0,
        hintsUsed: 0,
        strategies: {},
      },
      counting: {
        attempted: 0,
        correct: 0,
        accuracy: 0,
        timeSpent: 0,
        averageTime: 0,
        highestScore: 0,
        perfectScores: 0,
        hintsUsed: 0,
        strategies: {},
      },
      multiplication: {
        attempted: 0,
        correct: 0,
        accuracy: 0,
        timeSpent: 0,
        averageTime: 0,
        highestScore: 0,
        perfectScores: 0,
        hintsUsed: 0,
        strategies: {},
      },
      division: {
        attempted: 0,
        correct: 0,
        accuracy: 0,
        timeSpent: 0,
        averageTime: 0,
        highestScore: 0,
        perfectScores: 0,
        hintsUsed: 0,
        strategies: {},
      },
      averageTimePerProblem: 0,
      lastPlayed: new Date().toISOString(),
      achievements: [],
    };
  } catch (error) {
    console.error("Error getting math stats:", error);
    return {
      totalProblems: 0,
      correctAnswers: 0,
      streak: 0,
      highestStreak: 0,
      addition: {
        attempted: 0,
        correct: 0,
        accuracy: 0,
        timeSpent: 0,
        averageTime: 0,
        highestScore: 0,
        perfectScores: 0,
        hintsUsed: 0,
        strategies: {},
      },
      subtraction: {
        attempted: 0,
        correct: 0,
        accuracy: 0,
        timeSpent: 0,
        averageTime: 0,
        highestScore: 0,
        perfectScores: 0,
        hintsUsed: 0,
        strategies: {},
      },
      counting: {
        attempted: 0,
        correct: 0,
        accuracy: 0,
        timeSpent: 0,
        averageTime: 0,
        highestScore: 0,
        perfectScores: 0,
        hintsUsed: 0,
        strategies: {},
      },
      multiplication: {
        attempted: 0,
        correct: 0,
        accuracy: 0,
        timeSpent: 0,
        averageTime: 0,
        highestScore: 0,
        perfectScores: 0,
        hintsUsed: 0,
        strategies: {},
      },
      division: {
        attempted: 0,
        correct: 0,
        accuracy: 0,
        timeSpent: 0,
        averageTime: 0,
        highestScore: 0,
        perfectScores: 0,
        hintsUsed: 0,
        strategies: {},
      },
      averageTimePerProblem: 0,
      lastPlayed: new Date().toISOString(),
      achievements: [],
    };
  }
}

/**
 * Save math stats for a specific child or user
 * @param stats Math stats to save
 * @param childId Optional child ID to save stats for
 * @returns Promise<boolean> indicating success or failure
 */
export async function saveMathStats(
  stats: MathStats,
  childId?: string
): Promise<boolean> {
  try {
    if (childId) {
      const childMathStats =
        (await getData(StorageKeys.CHILD_MATH_STATS)) || {};
      childMathStats[childId] = stats;
      return await storeData(StorageKeys.CHILD_MATH_STATS, childMathStats);
    } else {
      return await storeData(StorageKeys.MATH_STATS, stats);
    }
  } catch (error) {
    console.error("Error saving math stats:", error);
    return false;
  }
}

/**
 * Get shape stats for a specific child or user
 * @param childId Optional child ID to get stats for
 * @returns Promise with shape stats
 */
export async function getShapeStats(childId?: string): Promise<ShapeStats> {
  try {
    if (childId) {
      const childShapeStats = await getData(StorageKeys.CHILD_SHAPE_STATS);
      if (childShapeStats && childShapeStats[childId]) {
        return childShapeStats[childId];
      }
    } else {
      const shapeStats = await getData(StorageKeys.SHAPE_STATS);
      if (shapeStats) {
        return shapeStats;
      }
    }

    // Return default stats if none found
    return {
      totalShapes: 0,
      circles: {
        completed: 0,
        accuracy: 0,
        correct: 0,
        attempts: 0,
        timeSpent: 0,
        averageTime: 0,
        highestScore: 0,
        perfectScores: 0,
        hintsUsed: 0,
        propertiesLearned: [],
      },
      squares: {
        completed: 0,
        accuracy: 0,
        correct: 0,
        attempts: 0,
        timeSpent: 0,
        averageTime: 0,
        highestScore: 0,
        perfectScores: 0,
        hintsUsed: 0,
        propertiesLearned: [],
      },
      triangles: {
        completed: 0,
        accuracy: 0,
        correct: 0,
        attempts: 0,
        timeSpent: 0,
        averageTime: 0,
        highestScore: 0,
        perfectScores: 0,
        hintsUsed: 0,
        propertiesLearned: [],
      },
      polygons: {
        completed: 0,
        accuracy: 0,
        correct: 0,
        attempts: 0,
        timeSpent: 0,
        averageTime: 0,
        highestScore: 0,
        perfectScores: 0,
        hintsUsed: 0,
        propertiesLearned: [],
      },
      averageTimePerShape: 0,
      lastPlayed: new Date().toISOString(),
      achievements: [],
    };
  } catch (error) {
    console.error("Error getting shape stats:", error);
    return {
      totalShapes: 0,
      circles: {
        completed: 0,
        accuracy: 0,
        correct: 0,
        attempts: 0,
        timeSpent: 0,
        averageTime: 0,
        highestScore: 0,
        perfectScores: 0,
        hintsUsed: 0,
        propertiesLearned: [],
      },
      squares: {
        completed: 0,
        accuracy: 0,
        correct: 0,
        attempts: 0,
        timeSpent: 0,
        averageTime: 0,
        highestScore: 0,
        perfectScores: 0,
        hintsUsed: 0,
        propertiesLearned: [],
      },
      triangles: {
        completed: 0,
        accuracy: 0,
        correct: 0,
        attempts: 0,
        timeSpent: 0,
        averageTime: 0,
        highestScore: 0,
        perfectScores: 0,
        hintsUsed: 0,
        propertiesLearned: [],
      },
      polygons: {
        completed: 0,
        accuracy: 0,
        correct: 0,
        attempts: 0,
        timeSpent: 0,
        averageTime: 0,
        highestScore: 0,
        perfectScores: 0,
        hintsUsed: 0,
        propertiesLearned: [],
      },
      averageTimePerShape: 0,
      lastPlayed: new Date().toISOString(),
      achievements: [],
    };
  }
}

/**
 * Save shape stats for a specific child or user
 * @param stats Shape stats to save
 * @param childId Optional child ID to save stats for
 * @returns Promise<boolean> indicating success or failure
 */
export async function saveShapeStats(
  stats: ShapeStats,
  childId?: string
): Promise<boolean> {
  try {
    if (childId) {
      const childShapeStats =
        (await getData(StorageKeys.CHILD_SHAPE_STATS)) || {};
      childShapeStats[childId] = stats;
      return await storeData(StorageKeys.CHILD_SHAPE_STATS, childShapeStats);
    } else {
      return await storeData(StorageKeys.SHAPE_STATS, stats);
    }
  } catch (error) {
    console.error("Error saving shape stats:", error);
    return false;
  }
}

/**
 * Get reward progress for a user
 */
export async function getRewardProgress(
  childId?: string
): Promise<RewardProgress | null> {
  try {
    const key = childId
      ? StorageKeys.CHILD_REWARD_PROGRESS
      : StorageKeys.REWARD_PROGRESS;
    const data = await getData(key);

    if (childId && data) {
      return (data as { [key: string]: RewardProgress })[childId] || null;
    }

    return data as RewardProgress | null;
  } catch (error) {
    console.error("Failed to get reward progress:", error);
    return null;
  }
}

/**
 * Save reward progress for a user
 */
export async function saveRewardProgress(
  progress: RewardProgress,
  childId?: string
): Promise<boolean> {
  try {
    const key = childId
      ? StorageKeys.CHILD_REWARD_PROGRESS
      : StorageKeys.REWARD_PROGRESS;

    if (childId) {
      const allProgress = ((await getData(key)) || {}) as {
        [key: string]: RewardProgress;
      };
      allProgress[childId] = progress;
      return await storeData(key, allProgress);
    }

    return await storeData(key, progress);
  } catch (error) {
    console.error("Failed to save reward progress:", error);
    return false;
  }
}

interface ProgressEntry {
  word_challenges: number;
  math_problems: number;
  shapes: number;
  total_points: number;
}

interface RewardProgressData {
  dailyProgress: Record<string, ProgressEntry>;
  weeklyProgress: Record<string, ProgressEntry>;
  rewardRequirements: Record<string, Record<string, number>>;
  rewardProgress: Record<
    string,
    {
      progress: number;
      completed: boolean;
      dateCompleted: string | null;
    }
  >;
}

export const DAILY_POINTS_MAX = 100;

export async function updateRewardProgress(
  activityType: string,
  value: number,
  childId?: string
): Promise<{ success: boolean; completedRewards: Reward[] }> {
  try {
    // Get current progress
    let currentProgress = await getRewardProgress(childId);

    // Initialize if no progress exists
    if (!currentProgress) {
      currentProgress = initializeRewardProgress(childId || "default");
    }

    if (!currentProgress) {
      console.error("Failed to initialize reward progress");
      return { success: false, completedRewards: [] };
    }

    const today = new Date().toISOString().split("T")[0];
    const weekStart = getWeekStart(today);
    const completedRewards: Reward[] = [];

    // Update daily progress
    if (
      !currentProgress.dailyProgress ||
      currentProgress.dailyProgress.date !== today
    ) {
      currentProgress.dailyProgress = {
        date: today,
        points: 0,
        completed: [],
      };
    }
    const newDailyPoints = Math.min(
      currentProgress.dailyProgress.points + value,
      DAILY_POINTS_MAX
    );
    currentProgress.dailyProgress.points = newDailyPoints;

    // Update weekly progress
    if (
      !currentProgress.weeklyProgress ||
      currentProgress.weeklyProgress.weekStart !== weekStart
    ) {
      currentProgress.weeklyProgress = {
        weekStart,
        points: 0,
        completed: [],
      };
    }
    currentProgress.weeklyProgress.points += value;

    // Update rewards progress
    rewards.forEach((reward) => {
      if (!currentProgress.rewards[reward.id]) {
        currentProgress.rewards[reward.id] = {
          isCompleted: false,
          progress: 0,
          requirements: {},
        };
      }

      reward.requirements.forEach((req) => {
        if (req.type === activityType) {
          if (!currentProgress.rewards[reward.id].requirements[req.type]) {
            currentProgress.rewards[reward.id].requirements[req.type] = {
              current: 0,
              updatedAt: new Date().toISOString(),
            };
          }

          // Update current value
          currentProgress.rewards[reward.id].requirements[req.type].current +=
            value;
          currentProgress.rewards[reward.id].requirements[req.type].updatedAt =
            new Date().toISOString();

          // Calculate progress percentage
          const totalProgress = reward.requirements.reduce(
            (sum, requirement) => {
              const reqProgress =
                currentProgress.rewards[reward.id].requirements[
                  requirement.type
                ];
              if (!reqProgress) return sum;
              const progress = (reqProgress.current / requirement.target) * 100;
              return sum + Math.min(progress, 100);
            },
            0
          );

          // Update overall progress
          currentProgress.rewards[reward.id].progress = Math.round(
            totalProgress / reward.requirements.length
          );

          // Check if reward is completed
          if (
            currentProgress.rewards[reward.id].progress >= 100 &&
            !currentProgress.rewards[reward.id].isCompleted
          ) {
            currentProgress.rewards[reward.id].isCompleted = true;
            currentProgress.rewards[reward.id].completedAt =
              new Date().toISOString();

            // Add to completed list and add points with limit check
            if (reward.type === "daily") {
              currentProgress.dailyProgress.completed.push(reward.id);
              currentProgress.dailyProgress.points = Math.min(
                currentProgress.dailyProgress.points + reward.points,
                DAILY_POINTS_MAX
              );
              currentProgress.weeklyProgress.points += reward.points;
            }

            // Add to completedRewards array
            completedRewards.push(reward);
          }
        }
      });
    });

    // Save the updated progress
    const success = await saveRewardProgress(currentProgress, childId);
    return { success, completedRewards };
  } catch (error) {
    console.error("Error updating reward progress:", error);
    return { success: false, completedRewards: [] };
  }
}
