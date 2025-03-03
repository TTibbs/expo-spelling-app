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
  | "/settings" // Settings
  | "/achievements" // Achievements
  | "/leaderboard" // Leaderboard
  | "/tutorial" // Tutorial
  | "/feedback"; // Feedback

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
    level?: number;
  };
  "/subtraction": {
    difficulty?: "easy" | "medium" | "hard";
    level?: number;
  };
  "/counting": {
    maxNumber?: string;
    mode?: "ascending" | "descending" | "random";
  };
  "/circles": {
    level?: string;
    mode?: "learn" | "practice" | "quiz";
  };
  "/squares": {
    level?: string;
    mode?: "learn" | "practice" | "quiz";
  };
  "/triangles": {
    level?: string;
    mode?: "learn" | "practice" | "quiz";
  };
  "/tutorial": {
    section?: string;
    step?: number;
  };
  "/feedback": {
    type?: "bug" | "feature" | "general";
    source?: string;
  };
}

/**
 * Navigation state interface
 */
export interface NavigationState {
  index: number;
  routes: {
    name: AppRoute;
    params?: Record<string, unknown>;
    state?: NavigationState;
  }[];
  stale: boolean;
  type: string;
  key: string;
}

/**
 * Navigation event types
 */
export type NavigationEventType =
  | "state"
  | "beforeRemove"
  | "focus"
  | "blur"
  | "action";

/**
 * Navigation event payload
 */
export interface NavigationEventPayload {
  data: {
    state: NavigationState;
    action?: {
      type: string;
      payload?: unknown;
    };
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

/**
 * Navigation listener type
 */
export type NavigationListener = (
  event: NavigationEventType,
  payload: NavigationEventPayload
) => void;

/**
 * Navigation screen props
 */
export interface NavigationScreenProps<T extends AppRoute = AppRoute> {
  route: {
    name: T;
    params?: T extends RouteWithParams ? RouteParams[T] : undefined;
  };
  navigation: {
    navigate: NavigateFunction;
    goBack: () => void;
    setOptions: (options: Record<string, unknown>) => void;
    addListener: (
      type: NavigationEventType,
      listener: NavigationListener
    ) => void;
    removeListener: (
      type: NavigationEventType,
      listener: NavigationListener
    ) => void;
  };
}
