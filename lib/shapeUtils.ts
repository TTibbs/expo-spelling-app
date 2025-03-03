import {
  ShapeStorageData,
  ShapeCategoryStats,
  ShapeStats,
} from "@/types/shapes";
import { getData, storeData, StorageKeys } from "@/lib/storage";

/**
 * Type guard to check if an object is a valid ShapeCategoryStats
 * @param data The data to check
 * @returns boolean indicating if the data is a valid ShapeCategoryStats
 */
export function isShapeCategoryStats(
  data: unknown
): data is ShapeCategoryStats {
  if (!data || typeof data !== "object") return false;

  const stats = data as Partial<ShapeCategoryStats>;
  return (
    typeof stats.completed === "number" &&
    typeof stats.accuracy === "number" &&
    (stats.correct === undefined || typeof stats.correct === "number")
  );
}

/**
 * Type guard to check if an object is a valid ShapeStorageData
 * @param data The data to check
 * @returns boolean indicating if the data is a valid ShapeStorageData
 */
export function isShapeStorageData(data: unknown): data is ShapeStorageData {
  if (!data || typeof data !== "object") return false;

  const storage = data as Partial<ShapeStorageData>;
  return (
    typeof storage.totalShapes === "number" &&
    isShapeCategoryStats(storage.circles) &&
    isShapeCategoryStats(storage.squares) &&
    isShapeCategoryStats(storage.triangles)
  );
}

/**
 * Error type for shape storage operations
 */
export class ShapeStorageError extends Error {
  constructor(message: string, public originalError?: unknown) {
    super(message);
    this.name = "ShapeStorageError";
  }
}

/**
 * Loads shape statistics from storage
 * @returns Promise resolving to ShapeStorageData
 * @throws ShapeStorageError if loading fails or data is invalid
 */
export async function loadShapeStats(): Promise<ShapeStorageData> {
  try {
    const shapeStats = await getData(StorageKeys.SHAPE_STATS);
    if (!shapeStats) {
      return {
        totalShapes: 0,
        circles: {
          completed: 0,
          accuracy: 0,
          correct: 0,
          timeSpent: 0,
          averageTime: 0,
          highestScore: 0,
          perfectScores: 0,
          hintsUsed: 0,
          propertiesLearned: [],
        },
        squares: {
          completed: 0,
          accuracy: 0,
          correct: 0,
          timeSpent: 0,
          averageTime: 0,
          highestScore: 0,
          perfectScores: 0,
          hintsUsed: 0,
          propertiesLearned: [],
        },
        triangles: {
          completed: 0,
          accuracy: 0,
          correct: 0,
          timeSpent: 0,
          averageTime: 0,
          highestScore: 0,
          perfectScores: 0,
          hintsUsed: 0,
          propertiesLearned: [],
        },
        polygons: {
          completed: 0,
          accuracy: 0,
          correct: 0,
          timeSpent: 0,
          averageTime: 0,
          highestScore: 0,
          perfectScores: 0,
          hintsUsed: 0,
          propertiesLearned: [],
        },
        achievements: [],
        lastPlayed: new Date().toISOString(),
        settings: {
          soundEnabled: true,
          vibrationEnabled: true,
          showTimer: true,
          showHints: true,
          showExplanations: true,
          difficulty: "easy",
          gameMode: "learn",
          shapeCount: 10,
          showProperties: true,
          showMeasurements: true,
          showAngles: true,
        },
      };
    }

    // Convert ShapeStats to ShapeStorageData
    const storageData: ShapeStorageData = {
      totalShapes: shapeStats.totalShapes,
      circles: shapeStats.circles,
      squares: shapeStats.squares,
      triangles: shapeStats.triangles,
      polygons: shapeStats.polygons,
      achievements: shapeStats.achievements,
      lastPlayed: shapeStats.lastPlayed,
      settings: {
        soundEnabled: true,
        vibrationEnabled: true,
        showTimer: true,
        showHints: true,
        showExplanations: true,
        difficulty: "easy",
        gameMode: "learn",
        shapeCount: 10,
        showProperties: true,
        showMeasurements: true,
        showAngles: true,
      },
    };

    return storageData;
  } catch (error) {
    throw new ShapeStorageError("Error loading shape stats", error);
  }
}

/**
 * Saves shape statistics to storage
 * @param data ShapeStorageData to save
 * @throws ShapeStorageError if saving fails
 */
export async function saveShapeStats(data: ShapeStorageData): Promise<void> {
  try {
    // Convert ShapeStorageData to ShapeStats
    const statsData: ShapeStats = {
      totalShapes: data.totalShapes,
      circles: data.circles,
      squares: data.squares,
      triangles: data.triangles,
      polygons: data.polygons,
      achievements: data.achievements,
      lastPlayed: data.lastPlayed,
      averageTimePerShape: 0, // Calculate this based on timeSpent and totalShapes
    };

    const success = await storeData(StorageKeys.SHAPE_STATS, statsData);
    if (!success) {
      throw new Error("Failed to save shape stats");
    }
  } catch (error) {
    throw new ShapeStorageError("Error saving shape stats", error);
  }
}

/**
 * Updates a specific shape category's statistics
 * @param category The category to update ('circles', 'squares', or 'triangles')
 * @returns Promise resolving to the updated ShapeStorageData
 * @throws ShapeStorageError if operation fails
 */
export async function updateShapeCategoryStats(
  category: keyof Pick<ShapeStorageData, "circles" | "squares" | "triangles">
): Promise<ShapeStorageData> {
  try {
    const shapeStats = await loadShapeStats();

    // Update total shapes count
    shapeStats.totalShapes = (shapeStats.totalShapes || 0) + 1;

    // Ensure the category exists
    shapeStats[category] = shapeStats[category] || {
      completed: 0,
      accuracy: 0,
    };

    // Update completed count
    shapeStats[category].completed = (shapeStats[category].completed || 0) + 1;

    // Calculate new accuracy (for now, we just increment it)
    shapeStats[category].accuracy = Math.round(
      ((shapeStats[category].accuracy || 100) + 100) / 2
    );

    // Save the updated stats
    await saveShapeStats(shapeStats);

    return shapeStats;
  } catch (error) {
    if (error instanceof ShapeStorageError) {
      throw error;
    }
    throw new ShapeStorageError(`Error updating ${category} stats`, error);
  }
}
