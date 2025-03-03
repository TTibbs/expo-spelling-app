import { ShapeStorageData, ShapeCategoryStats } from "@/types/shapes";
import { getData, storeData, StorageKeys } from "@/lib/storage";

/**
 * Type guard to check if an object is a valid ShapeCategoryStats
 * @param data The data to check
 * @returns boolean indicating if the data is a valid ShapeCategoryStats
 */
export function isShapeCategoryStats(data: any): data is ShapeCategoryStats {
  return (
    data !== null &&
    typeof data === "object" &&
    typeof data.completed === "number" &&
    typeof data.accuracy === "number" &&
    (data.correct === undefined || typeof data.correct === "number")
  );
}

/**
 * Type guard to check if an object is a valid ShapeStorageData
 * @param data The data to check
 * @returns boolean indicating if the data is a valid ShapeStorageData
 */
export function isShapeStorageData(data: any): data is ShapeStorageData {
  return (
    data !== null &&
    typeof data === "object" &&
    typeof data.totalShapes === "number" &&
    isShapeCategoryStats(data.circles) &&
    isShapeCategoryStats(data.squares) &&
    isShapeCategoryStats(data.triangles)
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
      // Return default shape stats if none exist
      return {
        totalShapes: 0,
        circles: { completed: 0, accuracy: 0 },
        squares: { completed: 0, accuracy: 0 },
        triangles: { completed: 0, accuracy: 0 },
      };
    }

    return shapeStats;
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
    const success = await storeData(StorageKeys.SHAPE_STATS, data);
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
