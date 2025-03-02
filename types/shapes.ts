import { ReactNode } from "react";
import Ionicons from "@expo/vector-icons/Ionicons";

// Base Shape interface that can be extended by specific shapes
export interface Shape {
  id: number;
  name: string;
  description: string;
  properties: string[];
  image: string;
}

// Specific shape types
export interface Circle extends Shape {
  type: "circle" | "oval";
}

export interface Rectangle extends Shape {
  type: "square" | "rectangle";
}

export interface Triangle extends Shape {
  type: "equilateral" | "isosceles" | "scalene" | "right";
}

// Activity interface for the shapes main screen
export interface ShapeActivity {
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

// Shape statistics interface for AsyncStorage
export interface ShapeStats {
  totalShapes: number;
  circles: ShapeCategoryStats;
  squares: ShapeCategoryStats;
  triangles: ShapeCategoryStats;
}

export interface ShapeCategoryStats {
  completed: number;
  accuracy: number;
}
