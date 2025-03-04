/**
 * Types related to shapes and geometric learning activities
 */
import { Activity } from "./common";
import { Animated } from "react-native";

/**
 * Types of circles available in the app
 */
export type CircleType = "circle" | "oval";

/**
 * Types of rectangles available in the app
 */
export type RectangleType = "square" | "rectangle";

/**
 * Types of triangles available in the app
 */
export type TriangleType = "equilateral" | "isosceles" | "scalene" | "right";

/**
 * Types of polygons available in the app
 */
export type PolygonType = "pentagon" | "hexagon" | "octagon";

/**
 * Base Shape interface that can be extended by specific shapes
 */
export interface Shape {
  id: number;
  name: string;
  description: string;
  properties: string[];
  image: string;
  category: "circle" | "rectangle" | "triangle" | "polygon";
  difficulty: "easy" | "medium" | "hard";
  vertices?: number;
  sides?: number | number[];
  angles?: number[];
  area?: number;
  perimeter?: number;
  symmetry?: number;
  rotation?: number;
}

/**
 * Circle shape interface
 * @extends Shape
 */
export interface Circle extends Shape {
  type: CircleType;
  radius: number;
  diameter: number;
  circumference: number;
  area: number;
  center: { x: number; y: number };
}

/**
 * Rectangle shape interface
 * @extends Shape
 */
export interface Rectangle extends Shape {
  type: RectangleType;
  width: number;
  height: number;
  area: number;
  perimeter: number;
  diagonal: number;
  isSquare: boolean;
}

/**
 * Triangle shape interface
 * @extends Shape
 */
export interface Triangle extends Shape {
  type: TriangleType;
  base: number;
  height: number;
  sides: [number, number, number];
  angles: [number, number, number];
  area: number;
  perimeter: number;
  isRight: boolean;
}

/**
 * Polygon shape interface
 * @extends Shape
 */
export interface Polygon extends Shape {
  type: PolygonType;
  sides: number;
  vertices: number;
  angles: number[];
  area: number;
  perimeter: number;
  apothem?: number;
  radius?: number;
}

/**
 * Activity interface for the shapes main screen
 * @extends Activity
 */
export interface ShapeActivity extends Activity {
  category: "circle" | "rectangle" | "triangle" | "polygon";
  totalShapes: number;
  timeLimit?: number;
  allowHints?: boolean;
  showTimer?: boolean;
  showScore?: boolean;
  difficulty: "easy" | "medium" | "hard";
}

/**
 * Shape statistics interface for tracking progress
 */
export interface ShapeStats {
  totalShapes: number;
  circles: ShapeCategoryStats;
  squares: ShapeCategoryStats;
  triangles: ShapeCategoryStats;
  polygons: ShapeCategoryStats;
  averageTimePerShape: number;
  lastPlayed: string;
  achievements: string[];
}

/**
 * Statistics for a specific shape category
 */
export interface ShapeCategoryStats {
  completed: number;
  accuracy: number;
  correct: number;
  attempts: number;
  timeSpent: number;
  averageTime: number;
  highestScore: number;
  perfectScores: number;
  hintsUsed: number;
  propertiesLearned: string[];
}

/**
 * Interface for shape activity screen progress state
 */
export interface ShapeProgressState {
  currentIndex: number;
  score: number;
  completed: number;
  showAnswer: boolean;
  answerAnimation: Animated.Value;
  timeRemaining?: number;
  hintsRemaining?: number;
  level: number;
  showCelebration: boolean;
  showHint: boolean;
  showExplanation: boolean;
  isPaused: boolean;
  gameMode: "learn" | "practice" | "quiz";
  difficulty: "easy" | "medium" | "hard";
}

/**
 * Interface for shape game state
 */
export interface ShapeGameState {
  currentShape: Shape | null;
  score: number;
  streak: number;
  timeRemaining?: number;
  hintsRemaining?: number;
  level: number;
  shapesCompleted: number;
  showCelebration: boolean;
  showHint: boolean;
  showExplanation: boolean;
  isPaused: boolean;
  gameMode: "learn" | "practice" | "quiz";
  difficulty: "easy" | "medium" | "hard";
  selectedProperties: string[];
  correctProperties: string[];
  incorrectProperties: string[];
}

/**
 * Interface for shape game settings
 */
export interface ShapeGameSettings {
  soundEnabled: boolean;
  vibrationEnabled: boolean;
  showTimer: boolean;
  showHints: boolean;
  showExplanations: boolean;
  difficulty: "easy" | "medium" | "hard";
  gameMode: "learn" | "practice" | "quiz";
  timeLimit?: number;
  shapeCount: number;
  showProperties: boolean;
  showMeasurements: boolean;
  showAngles: boolean;
}

/**
 * Interface for shape achievements
 */
export interface ShapeAchievement {
  id: string;
  title: string;
  description: string;
  category: "circle" | "rectangle" | "triangle" | "polygon";
  requirement: {
    type: "score" | "streak" | "time" | "accuracy" | "properties";
    value: number;
  };
  reward: {
    xp: number;
    badge?: string;
  };
  unlocked: boolean;
  unlockedAt?: string;
}

/**
 * Interface for shape storage data structure
 */
export interface ShapeStorageData {
  totalShapes: number;
  circles: ShapeCategoryStats;
  squares: ShapeCategoryStats;
  triangles: ShapeCategoryStats;
  polygons: ShapeCategoryStats;
  achievements: string[];
  lastPlayed: string;
  settings: ShapeGameSettings;
}
