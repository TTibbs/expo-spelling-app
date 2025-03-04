import { Reward, RewardProgress, RewardRequirement } from "@/types/common";
import { rewards } from "./data";

/**
 * Generates a unique ID using a combination of timestamp and random numbers
 * @returns A unique string ID
 */
export function generateUniqueId(): string {
  const timestamp = Date.now().toString(36);
  const randomStr = Math.random().toString(36).substring(2, 8);
  return `${timestamp}-${randomStr}`;
}

/**
 * Initialize reward progress for a new user
 */
export function initializeRewardProgress(userId: string): RewardProgress {
  return {
    userId,
    rewards: rewards.reduce((acc, reward) => {
      acc[reward.id] = {
        isCompleted: false,
        progress: 0,
        requirements: {},
      };
      return acc;
    }, {} as RewardProgress["rewards"]),
    dailyProgress: {
      date: new Date().toISOString().split("T")[0],
      points: 0,
      completed: [],
    },
    weeklyProgress: {
      weekStart: getWeekStart(new Date().toISOString().split("T")[0]),
      points: 0,
      completed: [],
    },
  };
}

/**
 * Calculate progress percentage for a reward
 */
export function calculateRewardProgress(
  requirements: RewardRequirement[]
): number {
  if (!requirements.length) return 0;

  const totalProgress = requirements.reduce((sum, req) => {
    const progress = (req.current / req.target) * 100;
    return sum + Math.min(progress, 100);
  }, 0);

  return Math.round(totalProgress / requirements.length);
}

/**
 * Check if a reward's requirements are met
 */
export function checkRewardRequirements(
  requirements: RewardRequirement[]
): boolean {
  return requirements.every((req) => req.current >= req.target);
}

/**
 * Get the start date of the current week
 */
export function getWeekStart(date: string): string {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  const weekStart = new Date(d.setDate(diff));
  return weekStart.toISOString().split("T")[0];
}

/**
 * Format points for display
 */
export function formatPoints(points: number): string {
  if (points >= 1000) {
    return `${(points / 1000).toFixed(1)}K`;
  }
  return points.toString();
}

/**
 * Get available rewards for a user
 */
export function getAvailableRewards(progress: RewardProgress): Reward[] {
  return rewards.filter((reward) => {
    const rewardProgress = progress.rewards[reward.id];
    return !rewardProgress?.isCompleted && !reward.isLocked;
  });
}

/**
 * Get completed rewards for a user
 */
export function getCompletedRewards(progress: RewardProgress): Reward[] {
  return rewards.filter((reward) => {
    const rewardProgress = progress.rewards[reward.id];
    return rewardProgress?.isCompleted;
  });
}

/**
 * Get special (locked) rewards for a user
 */
export function getSpecialRewards(progress: RewardProgress): Reward[] {
  return rewards.filter((reward) => {
    const rewardProgress = progress.rewards[reward.id];
    return !rewardProgress?.isCompleted && reward.isLocked;
  });
}
