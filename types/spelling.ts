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
  timeSpent: number;
  hintsUsed: number;
  attempts: number;
  lettersGuessed: string[];
  difficulty: "easy" | "medium" | "hard";
  mode: "practice" | "challenge" | "quiz";
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
  averageTimePerWord: number;
  lastPlayed: string;
  achievements: string[];
  dailyProgress: {
    date: string;
    wordsLearned: number;
    accuracy: number;
    timeSpent: number;
  }[];
}

/**
 * Possible game states for the word spelling game
 */
export type WordGameStatus =
  | "initial"
  | "in-progress"
  | "completed"
  | "won"
  | "lost";

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
  value: Animated.Value | null;
  type?: AnimationType;
  timing?: AnimationTiming;
}

/**
 * Interface for the sound effect management
 */
export interface SoundState {
  sound: Audio.Sound | null;
  isLoaded: boolean;
  isPlaying: boolean;
  volume?: number;
  rate?: number;
  pitch?: number;
}

/**
 * Interface for a letter tile in the spelling game
 */
export interface LetterTile {
  id: string;
  letter: string;
  selected: boolean;
  position: number;
  status: "unused" | "correct" | "incorrect" | "hint";
  animation?: AnimationState;
  isHint?: boolean;
  isJoker?: boolean;
  points?: number;
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
  shadowStyle?: {
    shadowColor: string;
    shadowOffset: { width: number; height: number };
    shadowOpacity: number;
    shadowRadius: number;
    elevation?: number;
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
  timeSpent: number;
  hintsUsed: number;
  streak: number;
  highestStreak: number;
  difficulty: "easy" | "medium" | "hard";
  mode: "practice" | "challenge" | "quiz";
}

/**
 * Supported pronunciation sound types
 */
export type PronunciationSoundType =
  | "word"
  | "letter"
  | "phonetic"
  | "syllable";

/**
 * Interface for pronunciation state management
 */
export interface PronunciationState {
  isPronouncing: boolean;
  soundType: PronunciationSoundType;
  animation: Animated.Value;
  settings: PronunciationSettings;
  currentWord?: string;
  currentLetter?: string;
  currentSyllable?: string;
}

/**
 * Interface for user-configurable pronunciation settings
 */
export interface PronunciationSettings {
  enabled: boolean;
  rate: number;
  voice: string | null;
  autoPlay: boolean;
  breakdownLongWords: boolean;
  showPhonetics: boolean;
  showSyllables: boolean;
  volume: number;
  pitch: number;
}

/**
 * Interface for the word game state
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
  timeSpent: number;
  hintsUsed: number;
  difficulty: "easy" | "medium" | "hard";
  mode: "practice" | "challenge" | "quiz";
  animations: {
    main: AnimationState;
    letterFlip: AnimationState;
    successAnimation: AnimationState;
    hintAnimation: AnimationState;
  };
  sounds: {
    correct: SoundState;
    incorrect: SoundState;
    winner: SoundState;
    pronunciation?: SoundState;
    hint?: SoundState;
  };
  pronunciation?: {
    isPronouncing: boolean;
    lastPronounced: string | null;
    currentType: PronunciationSoundType;
  };
  hints: {
    available: number;
    used: number;
    lastUsed: string | null;
  };
  scoring: {
    basePoints: number;
    timeBonus: number;
    streakBonus: number;
    hintPenalty: number;
    totalPoints: number;
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
  disabled?: boolean;
  showHints?: boolean;
  onHintPress?: () => void;
  hintsRemaining?: number;
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
  isHint?: boolean;
  isJoker?: boolean;
  points?: number;
  animation?: AnimationState;
}

/**
 * Interface for letter button style state
 */
export interface LetterButtonStyleState {
  backgroundColor: string;
  borderStyle: string;
  textColor: string;
  shadowStyle?: {
    shadowColor: string;
    shadowOffset: { width: number; height: number };
    shadowOpacity: number;
    shadowRadius: number;
    elevation?: number;
  };
}

/**
 * Interface for word image display props
 */
export interface WordImageProps {
  imageUri: string;
  isLearned: boolean;
  isGameWon: boolean;
  showHint?: boolean;
  onHintPress?: () => void;
  hintsRemaining?: number;
  animation?: AnimationState;
}

/**
 * Interface for the word category selection button props
 */
export interface WordCategoryItemProps {
  item: WordCategory;
  isSelected: boolean;
  onSelect: (categoryId: string) => void;
  progress?: {
    completed: number;
    total: number;
    accuracy: number;
  };
  disabled?: boolean;
  animation?: AnimationState;
}

/**
 * Interface for the word item display props
 */
export interface WordItemProps {
  item: Word;
  onPress: (word: Word, category: string) => void;
  category: string;
  progress?: WordProgress;
  showProgress?: boolean;
  disabled?: boolean;
  animation?: AnimationState;
}

/**
 * Interface for the words screen state
 */
export interface WordsScreenState {
  selectedCategory: string;
  searchQuery: string;
  sortBy: "alphabetical" | "difficulty" | "progress" | "recent";
  filterBy: {
    difficulty?: "easy" | "medium" | "hard";
    mastered?: boolean;
    category?: string;
  };
  viewMode: "grid" | "list";
  showProgress: boolean;
  showSearch: boolean;
  showFilters: boolean;
  showSort: boolean;
  isLoading: boolean;
  error: string | null;
}
