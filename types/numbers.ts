import React from "react";
import Ionicons from "@expo/vector-icons/Ionicons";

// Math activity interface for the numbers main screen
export interface MathActivity {
  id: string;
  title: string;
  description: string;
  route: string;
  icon: React.ComponentProps<typeof Ionicons>["name"];
  color: string;
  backgroundColor: string;
  difficulty: "easy" | "medium" | "hard";
  available: boolean;
}

// Math problem interfaces
export interface MathProblem {
  id: number;
  question: string;
  options?: string[];
  correctAnswer: string | number;
  image?: string;
  difficulty: "easy" | "medium" | "hard";
}

// Addition problem
export interface AdditionProblem extends MathProblem {
  firstNumber: number;
  secondNumber: number;
}

// Subtraction problem
export interface SubtractionProblem extends MathProblem {
  firstNumber: number;
  secondNumber: number;
}

// Counting problem
export interface CountingProblem extends MathProblem {
  count: number;
}

// Math statistics interface for AsyncStorage
export interface MathStats {
  totalProblems: number;
  correctAnswers: number;
  streak: number;
  highestStreak: number;
  addition: MathCategoryStats;
  subtraction: MathCategoryStats;
  counting: MathCategoryStats;
}

export interface MathCategoryStats {
  attempted: number;
  correct: number;
  accuracy: number;
}

// Component Props Interfaces

// Addition Screen
export interface AdditionEquationProps {
  num1: number;
  num2: number;
  answer: number;
  selectedAnswer: number | null;
  onSelect: (answer: number) => void;
}

// Subtraction Screen
export interface SubtractionEquationProps {
  num1: number;
  num2: number;
  answer: number;
  selectedAnswer: number | null;
  onSelect: (answer: number) => void;
}

// Counting Screen
export interface NumberItemProps {
  number: number;
  onPress: (number: number) => void;
  selected: boolean;
  correct: boolean | null;
}

export interface NumberVisualProps {
  count: number;
  icon: string;
  color: string;
}

// Common interfaces for math activities
export interface MathEquation {
  num1: number;
  num2: number;
  answer: number;
}

export interface MathActivityState {
  score: number;
  streak: number;
  isCorrect: boolean | null;
  level: number;
  showCelebration: boolean;
}
