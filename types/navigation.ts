/**
 * Type definitions for app navigation
 */

/**
 * Available application routes
 */
export type AppRoute =
  | "/" // Home
  | "/profile" // Profile
  | "/word/[id]" // Word Detail
  | "/words" // Words List
  | "/learning" // Learning Paths
  | "/numbers" // Numbers & Math
  | "/chores" // Chores
  | "/shapes" // Shapes
  | "/addition" // Addition Game
  | "/subtraction" // Subtraction Game
  | "/counting" // Counting Game
  | "/circles" // Circles Game
  | "/squares" // Squares Game
  | "/triangles" // Triangles Game
  | "/settings"; // Settings

/**
 * Parameters for routes that accept them
 */
export interface RouteParams {
  "/word/[id]": {
    id: string;
    category: string;
  };
  "/addition": {
    difficulty?: "easy" | "medium" | "hard";
  };
  "/subtraction": {
    difficulty?: "easy" | "medium" | "hard";
  };
  "/counting": {
    maxNumber?: string;
  };
  "/circles": {
    level?: string;
  };
  "/squares": {
    level?: string;
  };
  "/triangles": {
    level?: string;
  };
}

/**
 * Navigation helper types
 */
export type RouteWithParams = keyof RouteParams;
export type RouteWithoutParams = Exclude<AppRoute, RouteWithParams>;

/**
 * Type for route that can include parameters
 */
export type NavigateOptions<T extends AppRoute> = T extends RouteWithParams
  ? { route: T; params: RouteParams[T] }
  : { route: T };

/**
 * Type-safe navigation function signature
 */
export type NavigateFunction = <T extends AppRoute>(
  options: NavigateOptions<T>
) => void;
