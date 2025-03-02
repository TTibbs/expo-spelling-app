import { Word, WordCategory } from "./common";

// Re-export types from common.ts
export { Word, WordCategory };

// Spelling attempt tracking
export interface SpellingAttempt {
  wordId: string;
  word: string;
  category: string;
  correct: boolean;
  date: string;
}

// Spelling statistics for AsyncStorage
export interface SpellingStats {
  totalAttempts: number;
  correctAttempts: number;
  accuracy: number;
  streak: number;
  highestStreak: number;
  wordsLearned: number;
  categories: {
    [categoryId: string]: {
      attempted: number;
      correct: number;
      accuracy: number;
    };
  };
}

// Letter tile interface
export interface LetterTile {
  id: string;
  letter: string;
  selected: boolean;
  position: number;
}

// Word progress tracking
export interface WordProgress {
  wordId: string;
  attempts: number;
  mastered: boolean;
  lastAttempt: string;
}
