/**
 * Types related to the learning paths and educational content
 */
import { Activity, IconName } from "./common";

/**
 * Interface for learning paths displayed on the main learning screen
 * @extends Activity
 */
export interface LearningPath extends Activity {
  iconColor: string; // Specific to learning paths
}

// Re-export IconName for convenience
export { IconName };
