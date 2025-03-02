# Spelling Bee App - To-Do List

## Type System Refactoring

### Completed Tasks

#### General

- ✅ Created centralized type definition files in the `types/` directory
- ✅ Implemented single source of truth for type definitions
- ✅ Updated components to import types instead of defining them inline
- ✅ Fixed linter errors related to type usage

#### learning.tsx

- ✅ Created `types/learning.ts` with `LearningPath` interface
- ✅ Moved `IconName` type to a central location
- ✅ Updated learning.tsx to import and use `LearningPath` interface
- ✅ Removed inline interface definition for `LearningPath`

#### numbers.tsx & Math Activities

- ✅ Created `types/numbers.ts` with math-related interfaces
- ✅ Added `MathActivity`, `MathProblem`, and related interfaces
- ✅ Added component-specific interfaces like `AdditionEquationProps`
- ✅ Updated numbers.tsx to import and use `MathActivity` interface
- ✅ Updated addition.tsx to use `AdditionEquationProps` and `MathEquation`
- ✅ Updated subtraction.tsx to use `SubtractionEquationProps` and `MathEquation`
- ✅ Updated counting.tsx to use `NumberItemProps` and `NumberVisualProps`
- ✅ Properly typed `DifficultyBadge` component in numbers.tsx with string literals for difficulty level
- ✅ Added type safety for `handleActivityPress` function by using `MathActivity` parameter type
- ✅ Added proper typing for equation state management in addition.tsx and subtraction.tsx
- ✅ Added return type annotations for key functions in math activity components

#### shapes.tsx & Shape Activities

- ✅ Created `types/shapes.ts` with shape-related interfaces
- ✅ Added `Shape`, `Circle`, `Rectangle`, `Triangle` interfaces
- ✅ Added `ShapeActivity` and statistics interfaces
- ✅ Updated shapes.tsx to import and use `ShapeActivity` interface
- ✅ Updated circles.tsx to import `Circle` type
- ✅ Updated squares.tsx to import `Rectangle` type
- ✅ Updated triangles.tsx to import `Triangle` type
- ✅ Added proper typing for the `handleActivityPress` function with `ShapeActivity` parameter
- ✅ Typed the `DifficultyBadge` component with appropriate props
- ✅ Added type safety for the `ProgressIndicator` component props

#### Shape Activity Screens (circles.tsx, squares.tsx, triangles.tsx)

- ✅ Imported and used specific shape types from shapes.ts (Circle, Rectangle, Triangle)
- ✅ Used typed state for current shape with proper interfaces
- ✅ Used common structure and types across all shape activity screens
- ✅ Added typing for shape properties display

#### Word Detail Screen ([id].tsx)

- ✅ Used TypeScript string literals for sound types (`"correct" | "incorrect" | "winner"`)
- ✅ Added proper return type annotations for most functions (Promise<void>, Promise<UserProfile | null>, etc.)
- ✅ Used nullable return types where appropriate (JSX.Element | null)
- ✅ Added type safety for XP calculations and word tracking
- ✅ Properly typed navigation parameters

#### words.tsx

- ✅ Using `ListRenderItemInfo<WordCategory>` and `ListRenderItemInfo<Word>` for list rendering
- ✅ Added JSX.Element return type for WordsScreen and render functions
- ✅ Properly typed state with `useState<string>` for selectedCategory

#### profile.tsx

- ✅ Updated to import and use `MathStats` interface
- ✅ Fixed property names to match interface definitions (changed `completed` to `attempted` and added `streak`)

#### spelling.tsx

- ✅ Created `types/spelling.ts` with spelling-related interfaces
- ✅ Re-exported `Word` and `WordCategory` from `common.ts`
- ✅ Added interfaces for `SpellingAttempt`, `SpellingStats`, etc.

#### Global Types (common.ts)

- ✅ Created `types/common.ts` with shared interfaces and types used across the app
- ✅ Defined core entity types like `Word`, `WordCategory`, `UserProfile`, and `Chore`
- ✅ Added utility types like `PlayerLevel` and `XPValues`
- ✅ Created consistent type structure for data entities

#### App Components

- ✅ Used proper typing for PinModal component with `PinModalProps` interface
- ✅ Added type annotations for state variables in authentication components
- ✅ Used React.FC type with proper props interfaces for components
- ✅ Added return type annotations for key functions in PinProtection

### Upcoming Tasks

#### Shape Activity Screens (circles.tsx, squares.tsx, triangles.tsx)

- [ ] Add specific return type annotations for all functions (`loadProgress`, `saveProgress`, `handleNext`, etc.)
- [ ] Create a common interface for shape progress state
- [ ] Add type safety for AsyncStorage operations with proper error handling
- [ ] Create a dedicated interface for shape progress tracking
- [ ] Implement consistent error typing for try/catch blocks
- [ ] Add JSDoc comments to explain function purposes and parameters
- [ ] In triangles.tsx, add string literal types for the `type` parameter in `getTypeColor` and `getTypeText` functions
- [ ] Create utility functions for common AsyncStorage operations with proper typing
- [ ] Add typeguards to verify shape data structure when loading from storage

#### Word Detail Screen ([id].tsx)

- [ ] Create a dedicated interface for the word game state
- [ ] Add type safety for image sources and styling objects
- [ ] Create interfaces for the letter selection UI components
- [ ] Improve type safety for the word rendering helper functions
- [ ] Add stronger typing for the navigation parameters
- [ ] Create a dedicated type for the letter tiles array
- [ ] Add proper typing for animation values and styles
- [ ] Create utility types for the various game states (initial, in-progress, completed)
- [ ] Add type safety for local storage operations with word data
- [ ] Implement error boundaries with proper TypeScript support

#### numbers.tsx

- [ ] Define return types for all component functions
- [ ] Create a dedicated interface for the difficulty badge props instead of using inline type
- [ ] Add a proper interface for progress tracking
- [ ] Type the dropdown/selection mechanisms
- [ ] Add stronger type safety for route navigation with proper path typing

#### shapes.tsx

- [ ] Fix the `completed` property in the `ProgressIndicator` component to align with `ShapeStats` interface (rename to `attempted` or adjust interface)
- [ ] Add return type annotation for the `loadProgress` function
- [ ] Create type-safe wrapper for AsyncStorage operations with shapes data
- [ ] Add proper error typing for try/catch blocks
- [ ] Create a proper interface for the progress state instead of using a simple object

#### words.tsx

- [ ] Create interfaces for the word selection UI components
- [ ] Add type safety for the image source in the word items
- [ ] Add proper typing for navigation parameters
- [ ] Create interface for the word category selection mechanism
- [ ] Add return type annotation for category and word item rendering functions

#### addition.tsx & subtraction.tsx

- [ ] Add specific return type annotations for all functions
- [ ] Create a dedicated animation state interface
- [ ] Add proper error typing for AsyncStorage operations in try/catch blocks
- [ ] Create a type-safe wrapper for the AsyncStorage operations
- [ ] Implement more precise typing for the equation options and generation

#### counting.tsx

- [ ] Add specific return type annotations for all functions
- [ ] Create interface for the counting game state
- [ ] Add proper typing for the number selection mechanism
- [ ] Implement type-safe AsyncStorage operations
- [ ] Add proper error typing for try/catch blocks

#### chores.tsx

- [ ] Create `types/chores.ts` for chore-related interfaces
- [ ] Define and export `Chore` interface
- [ ] Add `ChoreCategory` interface
- [ ] Create `ChoreStats` interface for tracking completion statistics
- [ ] Update chores.tsx to import and use these interfaces
- [ ] Add type safety for AsyncStorage operations with chores data
- [ ] Define proper return types for functions like `calculateTotalXp`, `addChore`, etc.

#### index.tsx (Home Screen)

- [ ] Create interfaces for home screen UI components
- [ ] Add proper typing for home screen state
- [ ] Create type-safe data loading utilities specific to the home screen
- [ ] Add proper typing for analytics events
- [ ] Create interfaces for featured content

#### profile.tsx

- [ ] Create interfaces for profile UI components (stats cards, etc.)
- [ ] Add proper typing for the tab switching mechanism
- [ ] Create interface for rendering word items in the list
- [ ] Add type safety for AsyncStorage operations in profile loading
- [ ] Create interface for progress visualization components

#### learning.tsx

- [ ] Add type safety for route navigation
- [ ] Create interface for learning path statistics
- [ ] Improve typing for the path selection mechanism

#### General Improvements

- [ ] Add JSDoc comments to all interfaces
- [ ] Create validator functions for type safety when parsing AsyncStorage data
- [ ] Implement strict type checking for AsyncStorage access
- [ ] Add unit tests to verify type compatibility
- [ ] Create utility types for common patterns
- [ ] Audit the codebase for any remaining inline interface definitions
- [ ] Create a consistent approach to typing AsyncStorage operations across all components
- [ ] Add proper nullability handling with optional chaining and nullish coalescing
- [ ] Create shared utility types for common UI components (badges, cards, progress indicators)
- [ ] Implement a common pattern for typing AsyncStorage keys to prevent typos
- [ ] Create a central utility file for typed storage operations
- [ ] Create a type-safe router navigation solution with route parameters
- [ ] Implement a centralized error handling system with proper TypeScript integration
- [ ] Add TypeScript integration for analytics tracking with event type safety
- [ ] Create environment-specific type configurations
- [ ] Add runtime type checking for API responses and local storage data

## UI/UX Improvements

- [ ] Add loading states for data fetching operations
- [ ] Implement error handling with user-friendly messages
- [ ] Add animations for transitions between screens
- [ ] Improve accessibility features
- [ ] Add haptic feedback for interactive elements
- [ ] Create consistent styling across all learning activities
- [ ] Implement skeleton loaders for data loading states
- [ ] Add pull-to-refresh functionality for content updates
- [ ] Improve visual feedback for correct/incorrect answers
- [ ] Add completion animations and celebrations
- [ ] Implement adjustable difficulty levels with visual indicators
- [ ] Enhance the word detail screen with more engaging animations
- [ ] Improve shape visualization with interactive 3D models where applicable
- [ ] Add voice narration for shape properties and concepts
- [ ] Implement a consistent theme system with light/dark mode support
- [ ] Create a pin entry component with enhanced animation and feedback
- [ ] Add fingerprint/biometric authentication options where available
- [ ] Implement guided tutorials with progressive disclosure
- [ ] Create a unified notification system
- [ ] Add customization options for the user interface (font size, contrast, etc.)

## Feature Enhancements

- [ ] Implement offline mode functionality
- [ ] Add user preferences for customizing the learning experience
- [ ] Create a reward system with badges/achievements
- [ ] Add progress visualization with charts
- [ ] Implement social sharing features for achievements
- [ ] Add multi-language support for learning content
- [ ] Create a daily challenge system with streaks
- [ ] Implement a parent dashboard for monitoring progress
- [ ] Add timed challenges for math and spelling activities
- [ ] Create printable worksheets based on completed activities
- [ ] Add a shape discovery mode where users can find shapes in real-world photos
- [ ] Implement a word pronunciation feature for vocabulary building
- [ ] Add progressive learning paths based on user performance
- [ ] Create interactive quizzes combining shapes, words and numbers
- [ ] Add parental controls with detailed activity reporting
- [ ] Create a teacher/parent dashboard for tracking progress
- [ ] Implement cloud sync for user progress across devices
- [ ] Add accessibility features for users with different needs
- [ ] Create a content management system for easy updates

#### Common Types (common.ts)

- [ ] Add JSDoc comments to all type definitions for better documentation
- [ ] Create more specialized subtypes for entities with different states
- [ ] Add validation utilities for type checking common entities
- [ ] Consider adding branded types for IDs to prevent mixing different entity IDs
- [ ] Add more specific string literal types for icon names and categories

#### Settings Screen (settings.tsx)

- [ ] Create dedicated interface for app settings state
- [ ] Add proper type safety for settings storage operations
- [ ] Create interfaces for settings UI components
- [ ] Add return type annotations for all functions
- [ ] Improve error typing for settings operations

#### Data Utilities (data.ts)

- [ ] Add specific return type annotations for data-related functions
- [ ] Create type-safe data loading and saving utilities
- [ ] Add validation functions with proper type guards
- [ ] Create more specific error types for data operations
- [ ] Add comprehensive JSDoc documentation for data utilities

#### Authentication Components

- [ ] Create dedicated interfaces for authentication state
- [ ] Add proper typing for SecureStore operations
- [ ] Create a type-safe wrapper for PIN storage operations
- [ ] Add enhanced error handling with specific error types
- [ ] Create utility types for representing different authentication states
