/**
 * Types related to spelling activities and word learning
 */
import { Word, WordCategory, CategoryStats } from "./common";

// Re-export types from common.ts
export { Word, WordCategory };

/**
 * Interface to track a spelling attempt by the user
 */
export interface SpellingAttempt {
  wordId: string;
  word: string;
  category: string;
  correct: boolean;
  date: string;
}

/**
 * Interface for spelling statistics to track user progress
 */
export interface SpellingStats {
  totalAttempts: number;
  correctAttempts: number;
  accuracy: number;
  streak: number;
  highestStreak: number;
  wordsLearned: number;
  categories: {
    [categoryId: string]: CategoryStats;
  };
}

/**
 * Interface for a letter tile in the spelling game
 */
export interface LetterTile {
  id: string;
  letter: string;
  selected: boolean;
  position: number;
}

/**
 * Interface to track progress for a specific word
 */
export interface WordProgress {
  wordId: string;
  attempts: number;
  mastered: boolean;
  lastAttempt: string;
}
