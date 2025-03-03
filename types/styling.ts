import { ImageSourcePropType } from "react-native";

/**
 * Type for image sources in the app
 * Can be a URI object or a module reference (require)
 */
export type AppImageSource = ImageSourcePropType;

/**
 * Interface for application background styles
 */
export interface BackgroundStyle {
  backgroundColor: string;
  borderRadius?: number;
  opacity?: number;
}

/**
 * Interface for application text styles
 */
export interface TextStyle {
  color: string;
  fontSize: number;
  fontWeight?:
    | "normal"
    | "bold"
    | "100"
    | "200"
    | "300"
    | "400"
    | "500"
    | "600"
    | "700"
    | "800"
    | "900";
  textAlign?: "auto" | "left" | "right" | "center" | "justify";
}

/**
 * Interface for border styles
 */
export interface BorderStyle {
  borderWidth: number;
  borderColor: string;
  borderRadius?: number;
  borderStyle?: "solid" | "dotted" | "dashed";
}

/**
 * Interface for shadow styles
 */
export interface ShadowStyle {
  shadowColor: string;
  shadowOffset: {
    width: number;
    height: number;
  };
  shadowOpacity: number;
  shadowRadius: number;
  elevation?: number;
}

/**
 * Interface for combined button styles
 */
export interface ButtonStyle {
  container: {
    backgroundColor: string;
    padding?: number;
    margin?: number;
    width?: number | string;
    height?: number;
    borderRadius?: number;
  };
  text: TextStyle;
  border?: BorderStyle;
  shadow?: ShadowStyle;
  disabled?: {
    backgroundColor: string;
    opacity: number;
  };
}

/**
 * Interface for the badge UI component
 */
export interface BadgeStyle {
  container: {
    backgroundColor: string;
    padding: number[];
    borderRadius: number;
  };
  text: TextStyle;
}
