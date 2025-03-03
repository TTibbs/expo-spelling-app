import { LearningPath } from "@/types/learning";
import { Circle, Rectangle, Triangle } from "@/types/shapes";
import { MathActivity } from "@/types/numbers";
import { ShapeActivity } from "@/types/shapes";
import { Word, WordCategory, Chore } from "@/types/common";

export const learningPaths: LearningPath[] = [
  {
    id: "spelling",
    title: "Spelling & Words",
    description: "Learn to spell words with fun pictures",
    icon: "book-outline",
    iconColor: "#6366F1",
    backgroundColor: "#EEF2FF",
    route: "/learning/words",
    available: true,
    color: "#6366F1",
    difficulty: "easy",
    totalLessons: 20,
    completedLessons: 0,
    estimatedDuration: 30,
    tags: ["spelling", "words", "vocabulary"],
  },
  {
    id: "numbers",
    title: "Numbers & Math",
    description: "Count, add, subtract and more!",
    icon: "calculator-outline",
    iconColor: "#10B981",
    backgroundColor: "#ECFDF5",
    route: "/learning/numbers",
    available: true,
    color: "#10B981",
    difficulty: "easy",
    totalLessons: 25,
    completedLessons: 0,
    estimatedDuration: 45,
    tags: ["math", "numbers", "counting"],
  },
  {
    id: "shapes",
    title: "Shapes",
    description: "Learn about different shapes and patterns",
    icon: "shapes-outline",
    iconColor: "#F59E0B",
    backgroundColor: "#FEF3C7",
    route: "/learning/shapes",
    available: true,
    color: "#F59E0B",
    difficulty: "medium",
    totalLessons: 15,
    completedLessons: 0,
    estimatedDuration: 30,
    tags: ["shapes", "geometry", "patterns"],
  },
  {
    id: "phonics",
    title: "Phonics",
    description:
      "Advanced sound recognition, blending, and comprehensive phonetic learning",
    icon: "musical-notes-outline",
    iconColor: "#EC4899",
    backgroundColor: "#FCE7F3",
    route: "/learning/phonics",
    available: false,
    color: "#EC4899",
    difficulty: "medium",
    totalLessons: 30,
    completedLessons: 0,
    estimatedDuration: 60,
    tags: ["phonics", "sounds", "reading"],
  },
  {
    id: "memory",
    title: "Memory Games",
    description: "Test and improve your memory skills",
    icon: "extension-puzzle-outline",
    iconColor: "#8B5CF6",
    backgroundColor: "#EDE9FE",
    route: "/learning/memory",
    available: false,
    color: "#8B5CF6",
    difficulty: "medium",
    totalLessons: 20,
    completedLessons: 0,
    estimatedDuration: 40,
    tags: ["memory", "cognitive", "games"],
  },
  {
    id: "reading",
    title: "Reading",
    description: "Read fun stories and answer questions",
    icon: "library-outline",
    iconColor: "#3B82F6",
    backgroundColor: "#EFF6FF",
    route: "/learning/reading",
    available: false,
    color: "#3B82F6",
    difficulty: "hard",
    totalLessons: 35,
    completedLessons: 0,
    estimatedDuration: 75,
    tags: ["reading", "comprehension", "stories"],
  },
];

export const wordsByCategory: Record<string, Word[]> = {
  animals: [
    {
      id: "dog",
      word: "DOG",
      image:
        "https://dtsjrc96mj.ufs.sh/f/E1OdRdSFWCZSDfQx8alJebwp2xlgqY3jMGVs7hdF0mc6KkyQ",
    },
    {
      id: "cat",
      word: "CAT",
      image:
        "https://dtsjrc96mj.ufs.sh/f/E1OdRdSFWCZSD1puuslJebwp2xlgqY3jMGVs7hdF0mc6KkyQ",
    },
    {
      id: "elephant",
      word: "ELEPHANT",
      image:
        "https://dtsjrc96mj.ufs.sh/f/E1OdRdSFWCZS26ymDt1M4vrZwxQ0N1yhuKXDkFBT9qPA3dsf",
    },
    {
      id: "lion",
      word: "LION",
      image:
        "https://dtsjrc96mj.ufs.sh/f/E1OdRdSFWCZS2JXiWA1M4vrZwxQ0N1yhuKXDkFBT9qPA3dsf",
    },
    {
      id: "tiger",
      word: "TIGER",
      image:
        "https://dtsjrc96mj.ufs.sh/f/E1OdRdSFWCZSjg0aUxnhsGFjivqmwBAdUOJTr7RLVucZ2EIH",
    },
    {
      id: "zebra",
      word: "ZEBRA",
      image:
        "https://dtsjrc96mj.ufs.sh/f/E1OdRdSFWCZSjCotdxnhsGFjivqmwBAdUOJTr7RLVucZ2EIH",
    },
    {
      id: "panda",
      word: "PANDA",
      image:
        "https://dtsjrc96mj.ufs.sh/f/E1OdRdSFWCZSVpxz5H4dxrnH03DvhITlM1JBybYamwAWoO9q",
    },
    {
      id: "monkey",
      word: "MONKEY",
      image:
        "https://dtsjrc96mj.ufs.sh/f/E1OdRdSFWCZSdav37kADMlEjw4tkcx0UP3mLh9ufo5BIa2V1",
    },
    {
      id: "giraffe",
      word: "GIRAFFE",
      image:
        "https://dtsjrc96mj.ufs.sh/f/E1OdRdSFWCZS4vjBgzKPIQKJkTlq8c0fB4LAruWhgDwy9vjO",
    },
    {
      id: "kangaroo",
      word: "KANGAROO",
      image:
        "https://dtsjrc96mj.ufs.sh/f/E1OdRdSFWCZSLPscvnHwrE4nBUfmD5JYS9RpVO8bj3KFcioG",
    },
    {
      id: "penguin",
      word: "PENGUIN",
      image:
        "https://dtsjrc96mj.ufs.sh/f/E1OdRdSFWCZSnvfpNvoalE5CuiI20k97KNb3tPovUHDYXjch",
    },
  ],
  fruits: [
    {
      id: "apple",
      word: "APPLE",
      image:
        "https://dtsjrc96mj.ufs.sh/f/E1OdRdSFWCZS5WAkKS79sKImhSWxFPQcnYTBi0rzptqOkLgy",
    },
    {
      id: "banana",
      word: "BANANA",
      image:
        "https://dtsjrc96mj.ufs.sh/f/E1OdRdSFWCZSbqSKh7fVaPvojbXHSNfQdGWr7nqUiAt9yYFm",
    },
    {
      id: "orange",
      word: "ORANGE",
      image:
        "https://dtsjrc96mj.ufs.sh/f/E1OdRdSFWCZSj3wNxEnhsGFjivqmwBAdUOJTr7RLVucZ2EIH",
    },
    {
      id: "strawberry",
      word: "STRAWBERRY",
      image:
        "https://dtsjrc96mj.ufs.sh/f/E1OdRdSFWCZSiAJMVOBsfTOpHWVJmKRu81MsxDLAYPZdGQhr",
    },
    {
      id: "pineapple",
      word: "PINEAPPLE",
      image:
        "https://dtsjrc96mj.ufs.sh/f/E1OdRdSFWCZSReVhGkUekrSKANg6utVqnFThQyHJOCZdp87l",
    },
    {
      id: "mango",
      word: "MANGO",
      image:
        "https://dtsjrc96mj.ufs.sh/f/E1OdRdSFWCZSx5FowgisONvSfLK1Ejzm4lriYVBh3geFwIuG",
    },
    {
      id: "kiwi",
      word: "KIWI",
      image:
        "https://dtsjrc96mj.ufs.sh/f/E1OdRdSFWCZSDwqZ9xlJebwp2xlgqY3jMGVs7hdF0mc6KkyQ",
    },
    {
      id: "pear",
      word: "PEAR",
      image:
        "https://dtsjrc96mj.ufs.sh/f/E1OdRdSFWCZSC5hv1ATYdz2utbITNaBZ8rAigRnEXL06mFsU",
    },
    {
      id: "peach",
      word: "PEACH",
      image:
        "https://dtsjrc96mj.ufs.sh/f/E1OdRdSFWCZSYNZwTaBhMZ4sfkQVwby8GzJol7UC30mcvBiS",
    },
  ],
  colors: [
    {
      id: "red",
      word: "RED",
      image:
        "https://dtsjrc96mj.ufs.sh/f/E1OdRdSFWCZSntZenNoalE5CuiI20k97KNb3tPovUHDYXjch",
    },
    {
      id: "blue",
      word: "BLUE",
      image:
        "https://dtsjrc96mj.ufs.sh/f/E1OdRdSFWCZSKPPvaJm5J8KSdyL5GaXOptMRUHY3bBDi9m4T",
    },
    {
      id: "green",
      word: "GREEN",
      image:
        "https://dtsjrc96mj.ufs.sh/f/E1OdRdSFWCZSwgoz1B18ZbTGdqpzrLhEBC6AjWRFU1nvwHfc",
    },
    {
      id: "orange",
      word: "ORANGE",
      image:
        "https://dtsjrc96mj.ufs.sh/f/E1OdRdSFWCZSbNaxccfVaPvojbXHSNfQdGWr7nqUiAt9yYFm",
    },
    {
      id: "purple",
      word: "PURPLE",
      image:
        "https://dtsjrc96mj.ufs.sh/f/E1OdRdSFWCZS7k58y8PI5DAPhK0S4OxwJNsFmQgkVazdL6ir",
    },
    {
      id: "yellow",
      word: "YELLOW",
      image:
        "https://dtsjrc96mj.ufs.sh/f/E1OdRdSFWCZSmQqWPGDfQbW2cevsHodzPSLq57Nt8CBZRuG3",
    },
    {
      id: "pink",
      word: "PINK",
      image:
        "https://dtsjrc96mj.ufs.sh/f/E1OdRdSFWCZSl6uCODypjqye9wTSMZJoIHOd8hu2vDKcfCVP",
    },
    {
      id: "brown",
      word: "BROWN",
      image:
        "https://dtsjrc96mj.ufs.sh/f/E1OdRdSFWCZSTUsSt6VCy5z6Rwf7eFcUWanZSEo4lOVd98uh",
    },
    {
      id: "gray",
      word: "GRAY",
      image:
        "https://dtsjrc96mj.ufs.sh/f/E1OdRdSFWCZSRdYAbFUekrSKANg6utVqnFThQyHJOCZdp87l",
    },
    {
      id: "black",
      word: "BLACK",
      image:
        "https://dtsjrc96mj.ufs.sh/f/E1OdRdSFWCZSmAHAKeDfQbW2cevsHodzPSLq57Nt8CBZRuG3",
    },
    {
      id: "white",
      word: "WHITE",
      image:
        "https://dtsjrc96mj.ufs.sh/f/E1OdRdSFWCZSKO3zvR5J8KSdyL5GaXOptMRUHY3bBDi9m4Th",
    },
    {
      id: "cyan",
      word: "CYAN",
      image:
        "https://dtsjrc96mj.ufs.sh/f/E1OdRdSFWCZSoRl26z4AjnOXWLYkm0l1D9e6qMcyugPZp5EH",
    },
    {
      id: "lime",
      word: "LIME",
      image:
        "https://dtsjrc96mj.ufs.sh/f/E1OdRdSFWCZSHRRQrkfJ1lNEDnoxSku9J6gBzTIfqG80tKeR",
    },
  ],
  vehicles: [
    {
      id: "car",
      word: "CAR",
      image:
        "https://dtsjrc96mj.ufs.sh/f/E1OdRdSFWCZSOVbnqiRszmLi8lAQ3o70IuwkSCqF65EbMth4",
    },
    {
      id: "bus",
      word: "BUS",
      image:
        "https://dtsjrc96mj.ufs.sh/f/E1OdRdSFWCZSZ26sSegKy5UVb19hF2EsRTX6klz8G4cICnWt",
    },
    {
      id: "train",
      word: "TRAIN",
      image:
        "https://dtsjrc96mj.ufs.sh/f/E1OdRdSFWCZSjRFXRKnhsGFjivqmwBAdUOJTr7RLVucZ2EIH",
    },
    {
      id: "boat",
      word: "BOAT",
      image:
        "https://dtsjrc96mj.ufs.sh/f/E1OdRdSFWCZSzbvbNf3W6FBjV4KuSe8o9Um1xpkHADfzqdQa",
    },
    {
      id: "plane",
      word: "PLANE",
      image:
        "https://dtsjrc96mj.ufs.sh/f/E1OdRdSFWCZSMgMNQcCTSARXNcpDmPCsIZxUw3Ohnrl1uztF",
    },
    {
      id: "helicopter",
      word: "HELICOPTER",
      image:
        "https://dtsjrc96mj.ufs.sh/f/E1OdRdSFWCZSzyF2zZ3W6FBjV4KuSe8o9Um1xpkHADfzqdQa",
    },
    {
      id: "rocket",
      word: "ROCKET",
      image:
        "https://dtsjrc96mj.ufs.sh/f/E1OdRdSFWCZSpM5A4lrte2AGqnNrbaTYx1sEVJCulQL8whjF",
    },
    {
      id: "spaceship",
      word: "SPACESHIP",
      image:
        "https://dtsjrc96mj.ufs.sh/f/E1OdRdSFWCZSgnrWxsb3ocp5G4CFhHJiYvUZDqztrEX28byR",
    },
    {
      id: "submarine",
      word: "SUBMARINE",
      image:
        "https://dtsjrc96mj.ufs.sh/f/E1OdRdSFWCZSKP70Emz5J8KSdyL5GaXOptMRUHY3bBDi9m4T",
    },
    {
      id: "tank",
      word: "TANK",
      image:
        "https://dtsjrc96mj.ufs.sh/f/E1OdRdSFWCZS0RWGPbceQP5GdfqZ8DjtrRzLAUJ36vKXxnol",
    },
    {
      id: "truck",
      word: "TRUCK",
      image:
        "https://dtsjrc96mj.ufs.sh/f/E1OdRdSFWCZSXBBbwzLvQSv6UOPZ3cKmGq4JNV7rwefMBxC0",
    },
    {
      id: "bicycle",
      word: "BICYCLE",
      image:
        "https://dtsjrc96mj.ufs.sh/f/E1OdRdSFWCZSmWcijcDfQbW2cevsHodzPSLq57Nt8CBZRuG3",
    },
    {
      id: "motorbike",
      word: "MOTORBIKE",
      image:
        "https://dtsjrc96mj.ufs.sh/f/E1OdRdSFWCZSlM0PCFypjqye9wTSMZJoIHOd8hu2vDKcfCVP",
    },
    {
      id: "scooter",
      word: "SCOOTER",
      image:
        "https://dtsjrc96mj.ufs.sh/f/E1OdRdSFWCZSHnurX6J1lNEDnoxSku9J6gBzTIfqG80tKeRm",
    },
  ],
  nature: [
    {
      id: "tree",
      word: "TREE",
      image:
        "https://dtsjrc96mj.ufs.sh/f/E1OdRdSFWCZSg4q30Ob3ocp5G4CFhHJiYvUZDqztrEX28byR",
    },
    {
      id: "flower",
      word: "FLOWER",
      image:
        "https://dtsjrc96mj.ufs.sh/f/E1OdRdSFWCZSTUiolUVCy5z6Rwf7eFcUWanZSEo4lOVd98uh",
    },
    {
      id: "mountain",
      word: "MOUNTAIN",
      image:
        "https://dtsjrc96mj.ufs.sh/f/E1OdRdSFWCZSQWwPhWDzncu8gJmYbvV1W2M0sRNHZdepILKS",
    },
  ],
  sports: [
    {
      id: "soccer",
      word: "SOCCER",
      image:
        "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?q=80&w=500&auto=format&fit=crop",
    },
    {
      id: "basketball",
      word: "BASKETBALL",
      image:
        "https://images.unsplash.com/photo-1546519638-68e109acd27d?q=80&w=500&auto=format&fit=crop",
    },
    {
      id: "tennis",
      word: "TENNIS",
      image:
        "https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?q=80&w=500&auto=format&fit=crop",
    },
  ],
};

export const wordCategories: WordCategory[] = [
  { id: "animals", title: "Animals", icon: "🐘" },
  { id: "fruits", title: "Fruits", icon: "🍎" },
  { id: "colors", title: "Colors", icon: "🌈" },
  { id: "vehicles", title: "Vehicles", icon: "🚗" },
  { id: "nature", title: "Nature", icon: "🌲" },
  { id: "sports", title: "Sports", icon: "⚽" },
];

export const wordSounds: Record<string, string> = {
  // Using the cat sound as placeholder for all words for now
  // Format: wordId: soundUrl
  default:
    "https://dtsjrc96mj.ufs.sh/f/E1OdRdSFWCZSRvWDP30UekrSKANg6utVqnFThQyHJOCZdp87",

  // Animal sounds
  dog: "https://dtsjrc96mj.ufs.sh/f/E1OdRdSFWCZShiEpAVMANp2zgGotZdVJT3wsIH4W60qKbv1O",
  cat: "https://dtsjrc96mj.ufs.sh/f/E1OdRdSFWCZSRvWDP30UekrSKANg6utVqnFThQyHJOCZdp87",
  elephant:
    "https://dtsjrc96mj.ufs.sh/f/E1OdRdSFWCZSj4hac7BnhsGFjivqmwBAdUOJTr7RLVucZ2EI",
  lion: "https://dtsjrc96mj.ufs.sh/f/E1OdRdSFWCZS2KHxj51M4vrZwxQ0N1yhuKXDkFBT9qPA3dsf",
  tiger:
    "https://dtsjrc96mj.ufs.sh/f/E1OdRdSFWCZSr6MtZTunVQIyJRs3NpATD14KaLM8BGXPvxit",
  zebra:
    "https://dtsjrc96mj.ufs.sh/f/E1OdRdSFWCZS8rC992ZuSZTnACba4fj2QJtHw06plON7UyRM",
  panda:
    "https://dtsjrc96mj.ufs.sh/f/E1OdRdSFWCZSJ355QmOQB4UwnSy75ofFml8LZEOgkxC1biXG",
  monkey:
    "https://dtsjrc96mj.ufs.sh/f/E1OdRdSFWCZSjLScOfnhsGFjivqmwBAdUOJTr7RLVucZ2EIH",
  giraffe:
    "https://dtsjrc96mj.ufs.sh/f/E1OdRdSFWCZSRvWDP30UekrSKANg6utVqnFThQyHJOCZdp87",
  kangaroo:
    "https://dtsjrc96mj.ufs.sh/f/E1OdRdSFWCZS8lACQVZuSZTnACba4fj2QJtHw06plON7UyRM",
  penguin:
    "https://dtsjrc96mj.ufs.sh/f/E1OdRdSFWCZSOZ7HmYRszmLi8lAQ3o70IuwkSCqF65EbMth4",
};

export const playerLevels = [
  {
    id: "1",
    title: "Curious Explorer",
    description: "Taking your first steps into learning",
    minXp: 0,
    maxXp: 100,
  },
  {
    id: "2",
    title: "Word Wizard",
    description: "Your spelling skills are growing",
    minXp: 100,
    maxXp: 300,
  },
  {
    id: "3",
    title: "Brainy Buddy",
    description: "You're making impressive progress",
    minXp: 300,
    maxXp: 600,
  },
  {
    id: "4",
    title: "Knowledge Knight",
    description: "Defending the realm of learning",
    minXp: 600,
    maxXp: 1000,
  },
  {
    id: "5",
    title: "Scholar Superhero",
    description: "Your learning powers are phenomenal!",
    minXp: 1000,
    maxXp: 1500,
  },
  {
    id: "6",
    title: "Math Magician",
    description: "Casting spells of mathematical wisdom",
    minXp: 1500,
    maxXp: 2000,
  },
  {
    id: "7",
    title: "Genius Adventurer",
    description: "Exploring new frontiers of knowledge",
    minXp: 2000,
    maxXp: 2500,
  },
  {
    id: "8",
    title: "Spelling Superstar",
    description: "Your spelling skills are out of this world!",
    minXp: 2500,
    maxXp: 3000,
  },
  {
    id: "9",
    title: "Champion Challenger",
    description: "Taking on the toughest learning challenges",
    minXp: 3000,
    maxXp: 3500,
  },
  {
    id: "10",
    title: "Learning Legend",
    description: "You've achieved legendary learning status!",
    minXp: 3500,
    maxXp: 4000,
  },
];

// XP values for different actions
export const xpValues = {
  completeWord: 10, // Base XP for completing a word
  perfectWord: 5, // Additional XP for completing without mistakes
  fiveLetterWord: 10, // XP for completing a 5 letter word
  tenLetterWord: 20, // XP for completing a 10 letter word
  dailyStreak: 5, // XP for maintaining a daily streak
  completeChore: 15, // XP for completing a chore
  completeAllChores: 10, // Bonus XP for completing all assigned chores
  hintPenalty: 5, // XP penalty for using a hint
};

// Mock data for chore categories
export const choreCategories = [
  { id: "home", title: "Home", icon: "home" },
  { id: "school", title: "School", icon: "school" },
  { id: "personal", title: "Personal", icon: "person" },
  { id: "outdoor", title: "Outdoor", icon: "leaf" },
  { id: "other", title: "Other", icon: "create" },
];

// Mock data for chores by category
export const choresByCategory: Record<string, Chore[]> = {
  home: [
    {
      id: "make-bed",
      title: "Make Bed",
      icon: "bed-outline",
      xp: 10,
      category: "home",
      description: "Make your bed neatly",
    },
    {
      id: "clean-room",
      title: "Clean Room",
      icon: "home-outline",
      xp: 20,
      category: "home",
      description: "Clean and organize your room",
    },
    {
      id: "do-dishes",
      title: "Do Dishes",
      icon: "water-outline",
      xp: 15,
      category: "home",
      description: "Wash and dry the dishes",
    },
  ],
  school: [
    {
      id: "homework",
      title: "Do Homework",
      icon: "book-outline",
      xp: 25,
      category: "school",
      description: "Complete your homework",
    },
    {
      id: "pack-bag",
      title: "Pack School Bag",
      icon: "school-outline",
      xp: 10,
      category: "school",
      description: "Pack your school bag for tomorrow",
    },
  ],
  personal: [
    {
      id: "brush-teeth",
      title: "Brush Teeth",
      icon: "brush-outline",
      xp: 5,
      category: "personal",
      description: "Brush your teeth morning and night",
    },
    {
      id: "get-dressed",
      title: "Get Dressed",
      icon: "shirt-outline",
      xp: 5,
      category: "personal",
      description: "Get dressed independently",
    },
  ],
  outdoor: [
    {
      id: "walk-dog",
      title: "Walk Dog",
      icon: "paw-outline",
      xp: 15,
      category: "outdoor",
      description: "Take the dog for a walk",
    },
    {
      id: "garden",
      title: "Garden Work",
      icon: "leaf-outline",
      xp: 20,
      category: "outdoor",
      description: "Help with garden work",
    },
  ],
  other: [
    {
      id: "read",
      title: "Read",
      icon: "book-outline",
      xp: 15,
      category: "other",
      description: "Read for 20 minutes",
    },
    {
      id: "exercise",
      title: "Exercise",
      icon: "fitness-outline",
      xp: 15,
      category: "other",
      description: "Do some exercise",
    },
  ],
};

export const themes = [
  { icon: "star", color: "#F59E0B" },
  { icon: "heart", color: "#EF4444" },
  { icon: "flower", color: "#EC4899" },
  { icon: "happy", color: "#10B981" },
  { icon: "cube", color: "#6366F1" },
  { icon: "paw", color: "#8B5CF6" },
];

export const shapes: (Circle | Rectangle)[] = [
  {
    id: 1,
    name: "Circle",
    type: "circle",
    description: "A perfectly round shape",
    properties: ["radius", "diameter", "circumference", "area"],
    image: "circle.png",
    radius: 5,
    diameter: 10,
    circumference: 31.42,
    area: 78.54,
    center: { x: 0, y: 0 },
    category: "circle",
    difficulty: "easy",
  },
  {
    id: 2,
    name: "Oval",
    type: "circle",
    description: "An elongated circle",
    properties: ["radius", "diameter", "circumference", "area"],
    image: "oval.png",
    radius: 5,
    diameter: 10,
    circumference: 31.42,
    area: 78.54,
    center: { x: 0, y: 0 },
    category: "circle",
    difficulty: "easy",
  },
  {
    id: 3,
    name: "Square",
    type: "rectangle",
    description: "A four-sided shape with equal sides",
    properties: ["width", "height", "area", "perimeter"],
    image: "square.png",
    width: 10,
    height: 10,
    area: 100,
    perimeter: 40,
    diagonal: 14.14,
    isSquare: true,
    category: "rectangle",
    difficulty: "easy",
  },
  {
    id: 4,
    name: "Rectangle",
    type: "rectangle",
    description: "A four-sided shape with opposite sides equal",
    properties: ["width", "height", "area", "perimeter"],
    image: "rectangle.png",
    width: 15,
    height: 10,
    area: 150,
    perimeter: 50,
    diagonal: 18.03,
    isSquare: false,
    category: "rectangle",
    difficulty: "easy",
  },
];

export const triangles: Triangle[] = [
  {
    id: 5,
    name: "Equilateral Triangle",
    type: "equilateral",
    description: "A triangle with all sides equal",
    properties: ["base", "height", "area", "perimeter"],
    image: "equilateral.png",
    base: 10,
    height: 8.66,
    sides: [10, 10, 10],
    angles: [60, 60, 60],
    area: 43.3,
    perimeter: 30,
    isRight: false,
    category: "triangle",
    difficulty: "easy",
  },
  {
    id: 6,
    name: "Isosceles Triangle",
    type: "isosceles",
    description: "A triangle with two sides equal",
    properties: ["base", "height", "area", "perimeter"],
    image: "isosceles.png",
    base: 12,
    height: 8,
    sides: [10, 10, 12],
    angles: [76, 76, 28],
    area: 48,
    perimeter: 32,
    isRight: false,
    category: "triangle",
    difficulty: "easy",
  },
  {
    id: 7,
    name: "Scalene Triangle",
    type: "scalene",
    description: "A triangle with all sides different",
    properties: ["base", "height", "area", "perimeter"],
    image: "scalene.png",
    base: 15,
    height: 8,
    sides: [15, 10, 8],
    angles: [90, 45, 45],
    area: 60,
    perimeter: 33,
    isRight: true,
    category: "triangle",
    difficulty: "easy",
  },
  {
    id: 8,
    name: "Right Triangle",
    type: "right",
    description: "A triangle with one right angle",
    properties: ["base", "height", "area", "perimeter"],
    image: "right.png",
    base: 12,
    height: 5,
    sides: [12, 5, 13],
    angles: [90, 22.6, 67.4],
    area: 30,
    perimeter: 30,
    isRight: true,
    category: "triangle",
    difficulty: "easy",
  },
];

export const mathActivities: MathActivity[] = [
  {
    id: "addition",
    title: "Addition",
    description: "Practice adding numbers",
    route: "/learning/numbers/addition",
    icon: "add-circle-outline",
    color: "#4CAF50",
    backgroundColor: "#E8F5E9",
    difficulty: "easy",
    available: true,
    category: "addition",
    totalProblems: 20,
  },
  {
    id: "subtraction",
    title: "Subtraction",
    description: "Practice subtracting numbers",
    route: "/learning/numbers/subtraction",
    icon: "remove-circle-outline",
    color: "#F44336",
    backgroundColor: "#FFEBEE",
    difficulty: "easy",
    available: true,
    category: "subtraction",
    totalProblems: 20,
  },
  {
    id: "counting",
    title: "Counting Fun",
    description: "Learn to count from 1 to 20 with fun animations",
    route: "/learning/numbers/counting",
    icon: "list-outline",
    color: "#10B981",
    backgroundColor: "#ECFDF5",
    difficulty: "easy",
    available: true,
    category: "counting",
    totalProblems: 20,
  },
  {
    id: "multiplication",
    title: "Multiplication",
    description: "Learn multiplication tables",
    route: "/learning/numbers/multiplication",
    icon: "grid-outline",
    color: "#6366F1",
    backgroundColor: "#EEF2FF",
    difficulty: "hard",
    available: false,
    category: "multiplication",
    totalProblems: 20,
  },
  {
    id: "division",
    title: "Division",
    description: "Practice division problems",
    route: "/learning/numbers/division",
    icon: "cut-outline",
    color: "#F59E0B",
    backgroundColor: "#FEF3C7",
    difficulty: "hard",
    available: false,
    category: "division",
    totalProblems: 20,
  },
];

export const shapeActivities: ShapeActivity[] = [
  {
    id: "circles",
    title: "Circles",
    description: "Learn about circles and their properties",
    route: "/learning/shapes/circles",
    icon: "ellipse-outline",
    color: "#EF4444",
    backgroundColor: "#FEE2E2",
    difficulty: "easy",
    available: true,
    category: "circle",
    totalShapes: 10,
  },
  {
    id: "rectangles",
    title: "Rectangles",
    description: "Explore rectangles and squares",
    route: "/learning/shapes/rectangles",
    icon: "square-outline",
    color: "#3B82F6",
    backgroundColor: "#DBEAFE",
    difficulty: "medium",
    available: true,
    category: "rectangle",
    totalShapes: 10,
  },
  {
    id: "triangles",
    title: "Triangles",
    description: "Discover different types of triangles",
    route: "/learning/shapes/triangles",
    icon: "triangle-outline",
    color: "#10B981",
    backgroundColor: "#ECFDF5",
    difficulty: "medium",
    available: true,
    category: "triangle",
    totalShapes: 10,
  },
  {
    id: "polygons",
    title: "Polygons",
    description: "Learn about regular and irregular polygons",
    route: "/learning/shapes/polygons",
    icon: "grid-outline",
    color: "#8B5CF6",
    backgroundColor: "#F3E8FD",
    difficulty: "hard",
    available: false,
    category: "polygon",
    totalShapes: 10,
  },
  {
    id: "solids",
    title: "3D Shapes",
    description: "Explore three-dimensional shapes",
    route: "/learning/shapes/solids",
    icon: "cube-outline",
    color: "#F59E0B",
    backgroundColor: "#FEF3C7",
    difficulty: "hard",
    available: false,
    category: "polygon",
    totalShapes: 10,
  },
];
