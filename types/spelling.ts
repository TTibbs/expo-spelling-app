/**
 * Types related to spelling activities and word learning
 */
import { Word, WordCategory, CategoryStats } from "./common";
import { Animated } from "react-native";
import { AnimationType, AnimationTiming } from "./animations";
import { Audio } from "expo-av";

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
 * Possible game states for the word spelling game
 */
export type WordGameStatus = "initial" | "in-progress" | "completed" | "won";

/**
 * Animation status for different game elements
 */
export interface AnimationState {
  letterEntrance: {
    isActive: boolean;
    delay: number;
  };
  wordReveal: {
    isActive: boolean;
    duration: number;
  };
  winAnimation: {
    isActive: boolean;
  };
  value: Animated.Value | null; // Properly typed Animated value
  type?: AnimationType;
  timing?: AnimationTiming;
}

/**
 * Interface for the sound effect management
 */
export interface SoundState {
  sound: Audio.Sound | null; // Properly typed sound object
  isLoaded: boolean;
  isPlaying: boolean;
}

/**
 * Interface for a letter tile in the spelling game
 */
export interface LetterTile {
  id: string;
  letter: string;
  selected: boolean;
  position: number;
  status: "unused" | "correct" | "incorrect";
  animation?: AnimationState;
}

/**
 * Full letter tile type for rendering with style information
 */
export interface RenderableLetterTile extends LetterTile {
  backgroundColor: string;
  textColor: string;
  borderStyle: {
    borderWidth: number;
    borderColor: string;
    borderRadius: number;
  };
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

/**
 * Interface for the word game state
 * Represents the complete state of a word spelling game session
 */
export interface WordGameState {
  wordId: string;
  category: string;
  status: WordGameStatus;
  guessedLetters: string[];
  correctLetters: string[];
  incorrectLetters: string[];
  attempts: number;
  gameWon: boolean;
  wordAlreadyLearned: boolean;
  xpEarned: number;
  animations: {
    main: AnimationState;
    letterFlip: AnimationState;
    successAnimation: AnimationState;
  };
  sounds: {
    correct: SoundState;
    incorrect: SoundState;
    winner: SoundState;
  };
}

/**
 * Interface for letter selection component props
 */
export interface LetterSelectionProps {
  letters: string[];
  onLetterPress: (letter: string) => Promise<void>;
  guessedLetters: string[];
  correctLetters: string[];
  gameWon: boolean;
}

/**
 * Interface for individual letter button props
 */
export interface LetterButtonProps {
  letter: string;
  isGuessed: boolean;
  isCorrect: boolean;
  disabled: boolean;
  onPress: () => Promise<void>;
}

/**
 * Interface for letter button style state
 */
export interface LetterButtonStyleState {
  backgroundColor: string;
  borderStyle: string;
  textColor: string;
}

/**
 * Interface for word image display props
 */
export interface WordImageProps {
  imageUri: string;
  isLearned: boolean;
  isGameWon: boolean;
}
