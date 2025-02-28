export type Chore = {
  id: string;
  title: string;
  icon: string;
  xp: number;
  completed?: boolean;
};

export type Category = {
  id: string;
  title: string;
  icon: string;
};

export type CompletedChore = {
  id: string;
  title: string;
  category: string;
  xp: number;
  completedAt: string;
};

export type LearnedWord = {
  id: string;
  word: string;
  category: string;
  image: string;
  learnedAt: string;
};

export type Word = {
  id: string;
  word: string;
  image: string;
};

export type WordCategory = {
  id: string;
  title: string;
  icon: string;
};

export type UserProfile = {
  xp: number;
  level: string;
  lastPlayed: string | null;
};

export type PlayerLevel = {
  id: string;
  title: string;
  description: string;
  minXp: number;
  maxXp: number;
};

export type XPValues = {
  completeWord: number;
  perfectWord: number;
  dailyStreak: number;
  completeChore: number;
  completeAllChores: number;
};
