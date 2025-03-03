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
- ✅ Updated learning.tsx to load user profile data
- ✅ Added level and XP display button to learning.tsx header
- ✅ Ensured consistent styling with index.tsx profile button
- ✅ Implemented proper type safety for user profile in learning.tsx
- ✅ Used JSX.Element return type for components

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
- ✅ Add specific return type annotations for all functions (`loadProgress`, `saveProgress`, `handleNext`, etc.)
- ✅ Create a common interface for shape progress state
- ✅ Add typeguards to verify shape data structure when loading from storage
- ✅ Create utility functions for common AsyncStorage operations with proper typing
- ✅ Add error typing for try/catch blocks
- ✅ In triangles.tsx, add string literal types for the `type` parameter in `getTypeColor` and `getTypeText` functions
- ✅ Added specific return type (JSX.Element) to component functions
- ✅ Add specific return type annotations for functions in squares.tsx
- ✅ Implement consistent error typing for try/catch blocks in squares.tsx
- ✅ Create a dedicated interface for shape progress tracking in squares.tsx
- ✅ Add JSDoc comments to explain function purposes and parameters

#### Word Detail Screen ([id].tsx)

- ✅ Used TypeScript string literals for sound types (`"correct" | "incorrect" | "winner"`)
- ✅ Added proper return type annotations for most functions (Promise<void>, Promise<UserProfile | null>, etc.)
- ✅ Used nullable return types where appropriate (JSX.Element | null)
- ✅ Added type safety for XP calculations and word tracking
- ✅ Properly typed navigation parameters
- ✅ Create a dedicated interface for the word game state
- ✅ Create a dedicated type for the letter tiles array
- ✅ Create utility types for the various game states (initial, in-progress, completed)
- ✅ Add type safety for image sources and styling objects
- ✅ Create interfaces for the letter selection UI components
- ✅ Improve type safety for the word rendering helper functions
- ✅ Add stronger typing for navigation parameters
- ✅ Add proper typing for animation values and styles
- ✅ Add type safety for local storage operations with word data
- ✅ Implement error boundaries with proper TypeScript support
- ✅ Add pronunciation button to allow users to hear the word being pronounced
- [ ] Implement text-to-speech functionality using Expo's Speech API
- ✅ Add visual feedback when pronunciation is playing (e.g., speaker icon animation)
- ✅ Create proper TypeScript types for the pronunciation feature
- [ ] Add option to adjust speech rate for younger learners
- [ ] Implement error handling for text-to-speech failures
- [ ] Store user preferences for pronunciation settings (voice, speed)
- [ ] Consider adding phonics breakdown for longer words (syllable-by-syllable pronunciation)

#### words.tsx

- ✅ Create interfaces for the word selection UI components
- ✅ Add type safety for the image source in the word items
- ✅ Add proper typing for navigation parameters
- ✅ Create interface for the word category selection mechanism
- ✅ Add return type annotation for category and word item rendering functions
- ✅ Moved UI component interfaces to types/spelling.ts
- ✅ Centralized word-related type definitions

#### profile.tsx

- ✅ Updated to import and use `MathStats` interface
- ✅ Fixed property names to match interface definitions (changed `completed` to `attempted` and added `streak`)
- ✅ Implemented consistent user profile display across app screens
- ✅ Added profile button with level and XP to the Home screen header
- ✅ Added profile button with level and XP to the Learning screen header
- ✅ Created type-safe storage utilities for UserProfile management
- ✅ Implemented automatic level calculation based on XP thresholds
- ✅ Updated updateUserXp function to properly calculate level based on XP
- ✅ Added error handling for profile loading failures
- ✅ Created consistent UI components for displaying user level
- ✅ Implemented level validation logic when loading profiles
- ✅ Created centralized loadUserProfile utility function to reduce code duplication
- ✅ Updated index.tsx and learning.tsx to use the centralized loadUserProfile function

#### spelling.tsx

- ✅ Created `types/spelling.ts` with spelling-related interfaces
- ✅ Re-exported `Word` and `WordCategory` from `common.cs`
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
- ✅ Created type-safe wrapper for PIN storage operations
- ✅ Implemented proper error handling with specific error types
- ✅ Added type safety for SecureStore operations

#### Error Boundary Component

- ✅ Updated ErrorBoundary to use interfaces from common.ts
- ✅ Added proper typing for error handling and state management
- ✅ Implemented type-safe error boundary HOC with generics
- ✅ Added JSX.Element return type annotations
- ✅ Created proper error type definitions
- ✅ Added type safety for optional error callbacks

### Upcoming Tasks

#### numbers.tsx

- [ ] Define return types for all component functions
- [ ] Create a dedicated interface for the difficulty badge props instead of using inline type
- [ ] Add a proper interface for progress tracking
- [ ] Type the dropdown/selection mechanisms
- [ ] Add stronger type safety for route navigation with proper path typing

#### shapes.tsx

- [ ] Fix the `completed` property in the `ProgressIndicator` component to align with `ShapeStats` interface (rename to `attempted` or adjust interface)
- [ ] Add return type annotation for the `loadProgress` function
- ✅ Create type-safe wrapper for AsyncStorage operations with shapes data
- ✅ Add proper error typing for try/catch blocks
- [ ] Create a proper interface for the progress state instead of using a simple object

#### words.tsx

- [ ] Create interfaces for the word selection UI components
- [ ] Add type safety for the image source in the word items
- [ ] Add proper typing for navigation parameters
- [ ] Create interface for the word category selection mechanism
- [ ] Add return type annotation for category and word item rendering functions

#### addition.tsx & subtraction.tsx

- ✅ Add sound effect feedback for correct/incorrect answers
- [ ] Add specific return type annotations for all functions
- [ ] Create a dedicated animation state interface
- ✅ Add proper error typing for AsyncStorage operations in try/catch blocks
- ✅ Create a type-safe wrapper for the AsyncStorage operations
- [ ] Implement more precise typing for the equation options and generation

#### counting.tsx

- ✅ Add sound effect feedback for correct/incorrect answers
- [ ] Add specific return type annotations for all functions
- [ ] Create interface for the counting game state
- [ ] Add proper typing for the number selection mechanism
- ✅ Implement type-safe AsyncStorage operations
- ✅ Add proper error typing for try/catch blocks

#### chores.tsx

- [ ] Create `types/chores.ts` for chore-related interfaces
- [ ] Define and export `Chore` interface
- [ ] Add `ChoreCategory` interface
- [ ] Create `ChoreStats` interface for tracking completion statistics
- [ ] Update chores.tsx to import and use these interfaces
- ✅ Add type safety for AsyncStorage operations with chores data
- [ ] Define proper return types for functions like `calculateTotalXp`, `addChore`, etc.
- [x] Create user profile structure with XP and level
- [x] Implement profile screen
- [x] Add XP tracking and level calculation
- [x] Display user level and XP on home screen
- [x] Add profile button to home screen
- [x] Display user level and XP on learning screen
- [x] Add profile button to learning screen
- [x] Create centralized `loadUserProfile` utility function in `lib/storage.ts` to reduce code duplication
  - [x] Update `index.tsx` to use the centralized function
  - [x] Update `learning.tsx` to use the centralized function
- [x] Display user level and XP on chores screen
- [x] Add profile button to chores screen

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
- ✅ Add type safety for AsyncStorage operations in profile loading
- [ ] Create interface for progress visualization components
- [ ] Allow the parents to add multiple children profiles in parental controls for their own learning stats and paths

#### learning.tsx

- [ ] Add type safety for route navigation
- [ ] Create interface for learning path statistics
- [ ] Improve typing for the path selection mechanism
- ✅ Update phonics learning path to be a future comprehensive feature beyond basic word pronunciation

#### General Improvements

- ✅ Add JSDoc comments to all interfaces
- ✅ Create utility types for common patterns
- ✅ Implement shared interfaces for common functionality (like sound effects)
- ✅ Create validator functions for type safety when parsing AsyncStorage data
- ✅ Implement strict type checking for AsyncStorage access
- [ ] Add unit tests to verify type compatibility
- [ ] Audit the codebase for any remaining inline interface definitions
- ✅ Create a consistent approach to typing AsyncStorage operations across all components
- [ ] Add proper nullability handling with optional chaining and nullish coalescing
- [ ] Create shared utility types for common UI components (badges, cards, progress indicators)
- ✅ Implement a common pattern for typing AsyncStorage keys to prevent typos
- ✅ Create a central utility file for typed storage operations
- [ ] Create a type-safe router navigation solution with route parameters
- ✅ Implement a centralized error handling system with proper TypeScript integration
- [ ] Add TypeScript integration for analytics tracking with event type safety
- [ ] Create environment-specific type configurations
- ✅ Add runtime type checking for API responses and local storage data

## UI/UX Improvements

- ✅ Improve visual feedback for correct/incorrect answers with sound effects
- [ ] Add loading states for data fetching operations
- ✅ Implement error handling with user-friendly messages
- [ ] Add animations for transitions between screens
- [ ] Improve accessibility features
- [ ] Add haptic feedback for interactive elements
- [ ] Create consistent styling across all learning activities
- [ ] Implement skeleton loaders for data loading states
- [ ] Add pull-to-refresh functionality for content updates
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
- [x] Optimize chores screen UI with better spacing and fixed-height categories
  - [x] Add fixed height to category selector container
  - [x] Improve vertical spacing between UI elements
  - [x] Make dropdown stay open when adding chores
  - [x] Create more compact chore item display

## Feature Enhancements

- ✅ Add audio feedback for learning activities
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
- ✅ Add word pronunciation button to the word detail screen
- [ ] Implement progressive learning paths based on user performance
- [ ] Create interactive quizzes combining shapes, words and numbers
- [ ] Add parental controls with detailed activity reporting
- [ ] Create a teacher/parent dashboard for tracking progress
- [ ] Implement cloud sync for user progress across devices
- [ ] Add accessibility features for users with different needs
- [ ] Create a content management system for easy updates

#### Common Types (common.ts)

- ✅ Add JSDoc comments to all type definitions for better documentation
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
- ✅ Add validation functions with proper type guards
- ✅ Create more specific error types for data operations
- [ ] Add comprehensive JSDoc documentation for data utilities

#### Authentication Components

- [ ] Add biometric authentication support with proper TypeScript types
- [ ] Create dedicated types for different authentication states
- [ ] Add comprehensive error type definitions for auth failures
- [ ] Implement type-safe storage for authentication preferences

### Type System Improvements

- ✅ Create utility functions for common AsyncStorage operations with proper typing
- ✅ Add proper type definitions for all components and screens
- ✅ Implement type-safe navigation with route parameters
- ✅ Create type-safe animation configuration
- ✅ Add proper error boundary typing
- ✅ Create type-safe wrapper for AsyncStorage operations with shapes data
- ✅ Add proper error typing for AsyncStorage operations in try/catch blocks
- ✅ Create a type-safe wrapper for the AsyncStorage operations
- ✅ Implement type-safe AsyncStorage operations
- ✅ Add type safety for AsyncStorage operations with chores data
- ✅ Add type safety for AsyncStorage operations in profile loading
- ✅ Create validator functions for type safety when parsing AsyncStorage data
- ✅ Implement strict type checking for AsyncStorage access
- ✅ Create a consistent approach to typing AsyncStorage operations across all components
- ✅ Implement a common pattern for typing AsyncStorage keys to prevent typos
- ✅ Create a centralized sound management system in data.ts

### Optional

- [ ] Add a second button for word [id] screen for the sound the word/item makes (with a different icon like a musical note or animal paw). Only show this second button when a sound effect is available for that word.
- ✅ Implement dynamic sound loading with centralized sound management
