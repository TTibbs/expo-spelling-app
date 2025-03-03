/**
 * Types related to the learning paths and educational content
 */
import { Activity, IconName, Difficulty } from "./common";

/**
 * Interface for learning paths displayed on the main learning screen
 * @extends Activity
 */
export interface LearningPath extends Activity {
  iconColor: string;
  totalLessons: number;
  completedLessons: number;
  prerequisites?: string[];
  estimatedDuration: number;
  tags: string[];
  isRecommended?: boolean;
}

/**
 * Interface for individual lessons within a learning path
 */
export interface Lesson {
  id: string;
  title: string;
  description: string;
  content: LessonContent[];
  duration: number;
  difficulty: Difficulty;
  prerequisites?: string[];
  assessment?: Assessment;
}

/**
 * Types of lesson content
 */
export type LessonContent = {
  type: "text" | "image" | "video" | "interactive" | "quiz";
  content: string;
  metadata?: Record<string, unknown>;
};

/**
 * Interface for lesson assessments
 */
export interface Assessment {
  id: string;
  type: "multiple-choice" | "true-false" | "matching" | "fill-in-blank";
  questions: AssessmentQuestion[];
  passingScore: number;
  timeLimit?: number;
  allowRetry: boolean;
}

/**
 * Interface for assessment questions
 */
export interface AssessmentQuestion {
  id: string;
  question: string;
  type: "multiple-choice" | "true-false" | "matching" | "fill-in-blank";
  options?: string[];
  correctAnswer: string | string[];
  explanation?: string;
  points: number;
  difficulty: Difficulty;
}

/**
 * Interface for learning progress tracking
 */
export interface LearningProgress {
  pathId: string;
  userId: string;
  completedLessons: string[];
  assessmentScores: Record<string, number>;
  timeSpent: number;
  lastAccessed: string;
  status: "not-started" | "in-progress" | "completed";
  achievements: string[];
}

/**
 * Interface for learning achievements
 */
export interface LearningAchievement {
  id: string;
  title: string;
  description: string;
  icon: IconName;
  requirements: {
    type: "completion" | "score" | "time" | "streak";
    value: number;
    metric: string;
  };
  reward: {
    xp: number;
    badge?: string;
  };
}

/**
 * Interface for learning analytics
 */
export interface LearningAnalytics {
  totalTimeSpent: number;
  averageScore: number;
  completionRate: number;
  strengths: string[];
  weaknesses: string[];
  recommendedPaths: string[];
  learningStreak: number;
  lastWeekActivity: {
    date: string;
    timeSpent: number;
    lessonsCompleted: number;
  }[];
}

// Re-export IconName for convenience
export { IconName };
