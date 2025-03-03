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
  | "none";

/**
 * Direction for animations that support it
 */
export type AnimationDirection = "up" | "down" | "left" | "right";

/**
 * Animation timing configuration
 */
export interface AnimationTiming {
  duration: number;
  delay?: number;
  easing?: (value: number) => number;
}

/**
 * Animation configuration for components
 */
export interface AnimationConfig {
  type: AnimationType;
  direction?: AnimationDirection;
  timing: AnimationTiming;
  loop?: boolean;
  autoPlay?: boolean;
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
