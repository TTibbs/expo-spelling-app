import { Activity, CategoryStats, Difficulty } from "./common";

/**
 * Math activity interface for the numbers main screen
 * @extends Activity
 */
export interface MathActivity extends Activity {
  // Extended properties specific to math activities can be added here
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
}

/**
 * Interface for addition problems
 * @extends MathProblem
 */
export interface AdditionProblem extends MathProblem {
  firstNumber: number;
  secondNumber: number;
}

/**
 * Interface for subtraction problems
 * @extends MathProblem
 */
export interface SubtractionProblem extends MathProblem {
  firstNumber: number;
  secondNumber: number;
}

/**
 * Interface for counting problems
 * @extends MathProblem
 */
export interface CountingProblem extends MathProblem {
  count: number;
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
}

/**
 * Statistics for a specific math category
 * @extends CategoryStats
 */
export interface MathCategoryStats extends CategoryStats {
  // Extended properties specific to math category stats can be added here
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
}

/**
 * Props for the Number Item component in the counting screen
 */
export interface NumberItemProps {
  number: number;
  onPress: (number: number) => void;
  selected: boolean;
  correct: boolean | null;
}

/**
 * Props for the Number Visual component that displays a count of items
 */
export interface NumberVisualProps {
  count: number;
  icon: string;
  color: string;
}

/**
 * Common interface for math equations (addition, subtraction)
 */
export interface MathEquation {
  num1: number;
  num2: number;
  answer: number;
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
}
