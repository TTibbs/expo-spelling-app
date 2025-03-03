import AsyncStorage from "@react-native-async-storage/async-storage";
import { Word, LearnedWord, UserProfile, CompletedChore } from "@/types/common";
import { MathStats } from "@/types/numbers";
import { ShapeStats } from "@/types/shapes";
import {
  validateStorageData,
  ValidationStorageKeys,
  ValidationStorageData,
} from "@/lib/validation";
import { playerLevels } from "@/lib/data";

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
 * Get learned word status
 * @param wordId Word ID to check
 * @param category Word category
 * @returns Promise<boolean> indicating if the word is learned
 */
export async function isWordLearned(
  wordId: string,
  category: string
): Promise<boolean> {
  try {
    const learnedWords = await getData(StorageKeys.LEARNED_WORDS);
    if (!learnedWords) return false;

    return learnedWords.some(
      (word) => word.id === wordId && word.category === category
    );
  } catch (error) {
    console.error("Error checking if word is learned:", error);
    return false;
  }
}

/**
 * Save a learned word
 * @param word Word object to save
 * @param category Word category
 * @returns Promise<boolean> indicating success or failure
 */
export async function saveLearnedWord(
  word: Word,
  category: string
): Promise<boolean> {
  try {
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
  } catch (error) {
    console.error("Error saving learned word:", error);
    return false;
  }
}

/**
 * Update user profile with XP
 * @param xpToAdd Amount of XP to add
 * @returns Promise with updated user profile or null on failure
 */
export async function updateUserXp(
  xpToAdd: number
): Promise<UserProfile | null> {
  try {
    const userProfile = (await getData(StorageKeys.USER_PROFILE)) || {
      xp: 0,
      level: "1",
      lastPlayed: null,
    };

    // Add XP
    userProfile.xp += xpToAdd;
    userProfile.lastPlayed = new Date().toISOString();

    // Calculate level based on updated XP
    for (const level of playerLevels) {
      if (userProfile.xp >= level.minXp && userProfile.xp < level.maxXp) {
        userProfile.level = level.id;
        break;
      }
    }

    // Handle case where XP exceeds the highest level
    if (userProfile.xp >= playerLevels[playerLevels.length - 1].maxXp) {
      userProfile.level = playerLevels[playerLevels.length - 1].id;
    }

    // Save updated profile
    const success = await storeData(StorageKeys.USER_PROFILE, userProfile);
    return success ? userProfile : null;
  } catch (error) {
    console.error("Error updating user XP:", error);
    return null;
  }
}

/**
 * Load and validate user profile, ensuring the level is correct based on XP
 * @returns Promise with validated user profile
 */
export async function loadUserProfile(): Promise<UserProfile> {
  try {
    // Get user profile from storage
    const userProfile = await getData(StorageKeys.USER_PROFILE);

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
        await storeData(StorageKeys.USER_PROFILE, updatedProfile);
      }

      return updatedProfile;
    } else {
      // Create a default profile if none exists
      const defaultProfile: UserProfile = {
        xp: 0,
        level: "1",
        lastPlayed: new Date().toISOString(),
      };

      // Save the default profile
      await storeData(StorageKeys.USER_PROFILE, defaultProfile);
      return defaultProfile;
    }
  } catch (error) {
    console.error("Failed to load user profile:", error);
    // Return a default profile in case of error
    return {
      xp: 0,
      level: "1",
      lastPlayed: null,
    };
  }
}
