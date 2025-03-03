import { Animated } from "react-native";
import {
  FlipInXDown,
  FlipInYRight,
  FadeIn,
  FadeOut,
  ZoomIn,
  ZoomOut,
} from "react-native-reanimated";

/**
 * Animation type for different animation styles available in the app
 */
export type AnimationType =
  | "flip"
  | "fade"
  | "zoom"
  | "slide"
  | "bounce"
  | "spring"
  | "timing"
  | "none";

/**
 * Direction for animations that support it
 */
export type AnimationDirection = "up" | "down" | "left" | "right" | "center";

/**
 * Easing function type for animations
 */
export type EasingFunction =
  | "linear"
  | "ease"
  | "ease-in"
  | "ease-out"
  | "ease-in-out"
  | "bounce"
  | "spring"
  | ((value: number) => number);

/**
 * Animation timing configuration
 */
export interface AnimationTiming {
  duration: number;
  delay?: number;
  easing?: EasingFunction;
  iterations?: number;
  useNativeDriver?: boolean;
}

/**
 * Spring animation configuration
 */
export interface SpringConfig {
  damping: number;
  mass: number;
  stiffness: number;
  initialVelocity?: number;
  restDisplacementThreshold?: number;
  restSpeedThreshold?: number;
}

/**
 * Animation configuration for components
 */
export interface AnimationConfig {
  type: AnimationType;
  direction?: AnimationDirection;
  timing?: AnimationTiming;
  spring?: SpringConfig;
  loop?: boolean;
  autoPlay?: boolean;
  onComplete?: () => void;
  onStart?: () => void;
  onUpdate?: (value: number) => void;
}

/**
 * Standard animation values used throughout the app
 */
export interface StandardAnimations {
  flip: {
    in: {
      x: typeof FlipInXDown;
      y: typeof FlipInYRight;
    };
  };
  fade: {
    in: typeof FadeIn;
    out: typeof FadeOut;
  };
  zoom: {
    in: typeof ZoomIn;
    out: typeof ZoomOut;
  };
}

/**
 * Type for animation values used with React Native Animated
 */
export interface AnimatedValues {
  opacity: Animated.Value;
  scale: Animated.Value;
  translateX: Animated.Value;
  translateY: Animated.Value;
  rotate: Animated.Value;
}

/**
 * Complete animation state for tracking animations
 */
export interface AnimatedComponentState {
  values: AnimatedValues;
  config: AnimationConfig;
  isActive: boolean;
  isComplete: boolean;
}

/**
 * Type for animation callback functions
 */
export type AnimationCallback = () => void;
