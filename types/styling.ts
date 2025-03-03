import { ImageSourcePropType } from "react-native";

/**
 * Type for image sources in the app
 * Can be a URI object or a module reference (require)
 */
export type AppImageSource = ImageSourcePropType;

/**
 * Theme colors for consistent styling
 */
export interface ThemeColors {
  primary: string;
  secondary: string;
  background: string;
  surface: string;
  text: string;
  textSecondary: string;
  error: string;
  success: string;
  warning: string;
  info: string;
  border: string;
  shadow: string;
}

/**
 * Theme spacing for consistent layout
 */
export interface ThemeSpacing {
  xs: number;
  sm: number;
  md: number;
  lg: number;
  xl: number;
  xxl: number;
}

/**
 * Theme typography for consistent text styling
 */
export interface ThemeTypography {
  h1: TextStyle;
  h2: TextStyle;
  h3: TextStyle;
  body: TextStyle;
  caption: TextStyle;
  button: TextStyle;
}

/**
 * Complete theme interface
 */
export interface Theme {
  colors: ThemeColors;
  spacing: ThemeSpacing;
  typography: ThemeTypography;
  borderRadius: {
    sm: number;
    md: number;
    lg: number;
    xl: number;
    round: number;
  };
}

/**
 * Interface for application background styles
 */
export interface BackgroundStyle {
  backgroundColor: string;
  borderRadius?: number;
  opacity?: number;
  padding?: number | number[];
  margin?: number | number[];
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
  letterSpacing?: number;
  lineHeight?: number;
  textTransform?: "none" | "capitalize" | "uppercase" | "lowercase";
}

/**
 * Interface for border styles
 */
export interface BorderStyle {
  borderWidth: number;
  borderColor: string;
  borderRadius?: number;
  borderStyle?: "solid" | "dotted" | "dashed";
  borderTopWidth?: number;
  borderRightWidth?: number;
  borderBottomWidth?: number;
  borderLeftWidth?: number;
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
    padding?: number | number[];
    margin?: number | number[];
    width?: number | string;
    height?: number;
    borderRadius?: number;
    flexDirection?: "row" | "column";
    alignItems?: "flex-start" | "flex-end" | "center" | "stretch" | "baseline";
    justifyContent?:
      | "flex-start"
      | "flex-end"
      | "center"
      | "space-between"
      | "space-around"
      | "space-evenly";
  };
  text: TextStyle;
  border?: BorderStyle;
  shadow?: ShadowStyle;
  disabled?: {
    backgroundColor: string;
    opacity: number;
  };
  pressed?: {
    backgroundColor: string;
    opacity: number;
  };
  icon?: {
    size: number;
    color: string;
    margin?: number;
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
    minWidth?: number;
    minHeight?: number;
    alignItems?: "center";
    justifyContent?: "center";
  };
  text: TextStyle;
  dot?: {
    size: number;
    color: string;
  };
}
