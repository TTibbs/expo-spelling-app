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
 * Base Shape interface that can be extended by specific shapes
 */
export interface Shape {
  id: number;
  name: string;
  description: string;
  properties: string[];
  image: string;
}

/**
 * Circle shape interface
 * @extends Shape
 */
export interface Circle extends Shape {
  type: CircleType;
}

/**
 * Rectangle shape interface
 * @extends Shape
 */
export interface Rectangle extends Shape {
  type: RectangleType;
}

/**
 * Triangle shape interface
 * @extends Shape
 */
export interface Triangle extends Shape {
  type: TriangleType;
}

/**
 * Activity interface for the shapes main screen
 * @extends Activity
 */
export interface ShapeActivity extends Activity {
  // Extended properties specific to shape activities can be added here
}

/**
 * Shape statistics interface for tracking progress
 */
export interface ShapeStats {
  totalShapes: number;
  circles: ShapeCategoryStats;
  squares: ShapeCategoryStats;
  triangles: ShapeCategoryStats;
}

/**
 * Statistics for a specific shape category
 * @extends Partial<Omit<CategoryStats, "attempted">> to maintain compatibility with existing code
 */
export interface ShapeCategoryStats {
  completed: number; // Equivalent to 'attempted' in CategoryStats
  accuracy: number;
  correct?: number; // Optional to maintain compatibility with existing code
}

/**
 * Interface for shape activity screen progress state
 * Used to track user progress within shape learning activities
 */
export interface ShapeProgressState {
  currentIndex: number;
  score: number;
  completed: number;
  showAnswer: boolean;
  answerAnimation: Animated.Value; // Properly typed animation value
}

/**
 * Interface for shape storage data structure
 * Represents the shape statistics as stored in AsyncStorage
 */
export interface ShapeStorageData {
  totalShapes: number;
  circles: ShapeCategoryStats;
  squares: ShapeCategoryStats;
  triangles: ShapeCategoryStats;
}
