/**
 * Types related to shapes and geometric learning activities
 */
import { Activity } from "./common";

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
 * @extends CategoryStats with a renamed property
 */
export interface ShapeCategoryStats {
  completed: number; // This is equivalent to "attempted" in CategoryStats
  accuracy: number;
}
