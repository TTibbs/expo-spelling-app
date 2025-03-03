import { Activity, CategoryStats, Difficulty } from "./common";

/**
 * Math activity interface for the numbers main screen
 * @extends Activity
 */
export interface MathActivity extends Activity {
  category:
    | "addition"
    | "subtraction"
    | "counting"
    | "multiplication"
    | "division";
  totalProblems: number;
  timeLimit?: number;
  allowHints?: boolean;
  showTimer?: boolean;
  showScore?: boolean;
}

/**
 * Base interface for all math problems
 */
export interface MathProblem {
  id: number;
  question: string;
  options?: string[];
  correctAnswer: string | number;
  image?: string;
  difficulty: Difficulty;
  category:
    | "addition"
    | "subtraction"
    | "counting"
    | "multiplication"
    | "division";
  explanation?: string;
  hints?: string[];
  timeLimit?: number;
  points: number;
}

/**
 * Interface for addition problems
 * @extends MathProblem
 */
export interface AdditionProblem extends MathProblem {
  firstNumber: number;
  secondNumber: number;
  carryOver?: boolean;
  strategy?: "counting" | "decomposition" | "number-line";
}

/**
 * Interface for subtraction problems
 * @extends MathProblem
 */
export interface SubtractionProblem extends MathProblem {
  firstNumber: number;
  secondNumber: number;
  borrow?: boolean;
  strategy?: "counting" | "decomposition" | "number-line";
}

/**
 * Interface for counting problems
 * @extends MathProblem
 */
export interface CountingProblem extends MathProblem {
  count: number;
  startNumber?: number;
  step?: number;
  direction?: "forward" | "backward";
  objects?: string[];
}

/**
 * Interface for multiplication problems
 * @extends MathProblem
 */
export interface MultiplicationProblem extends MathProblem {
  firstNumber: number;
  secondNumber: number;
  timesTable?: number;
  strategy?: "repeated-addition" | "array" | "skip-counting";
}

/**
 * Interface for division problems
 * @extends MathProblem
 */
export interface DivisionProblem extends MathProblem {
  dividend: number;
  divisor: number;
  quotient: number;
  remainder?: number;
  strategy?: "repeated-subtraction" | "array" | "skip-counting";
}

/**
 * Math statistics interface for tracking progress across math activities
 */
export interface MathStats {
  totalProblems: number;
  correctAnswers: number;
  streak: number;
  highestStreak: number;
  addition: MathCategoryStats;
  subtraction: MathCategoryStats;
  counting: MathCategoryStats;
  multiplication: MathCategoryStats;
  division: MathCategoryStats;
  averageTimePerProblem: number;
  lastPlayed: string;
  achievements: string[];
}

/**
 * Statistics for a specific math category
 * @extends CategoryStats
 */
export interface MathCategoryStats extends CategoryStats {
  timeSpent: number;
  averageTime: number;
  highestScore: number;
  perfectScores: number;
  hintsUsed: number;
  strategies: Record<string, number>;
}

/**
 * Interface for math game state
 */
export interface MathGameState {
  currentProblem: MathProblem | null;
  score: number;
  streak: number;
  timeRemaining?: number;
  hintsRemaining?: number;
  level: number;
  problemsCompleted: number;
  showCelebration: boolean;
  showHint: boolean;
  showExplanation: boolean;
  isPaused: boolean;
  gameMode: "practice" | "challenge" | "quiz";
  difficulty: Difficulty;
}

/**
 * Interface for math game settings
 */
export interface MathGameSettings {
  soundEnabled: boolean;
  vibrationEnabled: boolean;
  showTimer: boolean;
  showHints: boolean;
  showExplanations: boolean;
  difficulty: Difficulty;
  gameMode: "practice" | "challenge" | "quiz";
  timeLimit?: number;
  problemCount: number;
  allowNegativeNumbers: boolean;
  allowDecimals: boolean;
}

/**
 * Interface for math achievements
 */
export interface MathAchievement {
  id: string;
  title: string;
  description: string;
  category:
    | "addition"
    | "subtraction"
    | "counting"
    | "multiplication"
    | "division";
  requirement: {
    type: "score" | "streak" | "time" | "accuracy";
    value: number;
  };
  reward: {
    xp: number;
    badge?: string;
  };
  unlocked: boolean;
  unlockedAt?: string;
}

// Component Props Interfaces

/**
 * Props for the Addition Equation component
 */
export interface AdditionEquationProps {
  num1: number;
  num2: number;
  answer: number;
  selectedAnswer: number | null;
  onSelect: (answer: number) => void;
  showStrategy?: boolean;
  timeRemaining?: number;
}

/**
 * Props for the Subtraction Equation component
 */
export interface SubtractionEquationProps {
  num1: number;
  num2: number;
  answer: number;
  selectedAnswer: number | null;
  onSelect: (answer: number) => void;
  showStrategy?: boolean;
  timeRemaining?: number;
}

/**
 * Props for the Number Item component in the counting screen
 */
export interface NumberItemProps {
  number: number;
  onPress: (number: number) => void;
  selected: boolean;
  correct: boolean | null;
  showCount?: boolean;
  count?: number;
  disabled?: boolean;
}

/**
 * Props for the Number Visual component that displays a count of items
 */
export interface NumberVisualProps {
  count: number;
  icon: string;
  color: string;
  size?: number;
  showCount?: boolean;
  animation?: boolean;
}

/**
 * Common interface for math equations (addition, subtraction)
 */
export interface MathEquation {
  num1: number;
  num2: number;
  answer: number;
  operator: "+" | "-" | "×" | "÷";
  difficulty: Difficulty;
}

/**
 * State interface for math activity screens
 */
export interface MathActivityState {
  score: number;
  streak: number;
  isCorrect: boolean | null;
  level: number;
  showCelebration: boolean;
  timeRemaining?: number;
  hintsRemaining?: number;
  problemsCompleted: number;
  showHint: boolean;
  showExplanation: boolean;
  isPaused: boolean;
  gameMode: "practice" | "challenge" | "quiz";
  difficulty: Difficulty;
}
