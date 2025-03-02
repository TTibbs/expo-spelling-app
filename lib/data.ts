import { LearningPath } from "@/types/learning";
import { Circle, Rectangle, Triangle } from "@/types/shapes";
import { MathActivity } from "@/types/numbers";
import { ShapeActivity } from "@/types/shapes";
import { WordCategory } from "@/types/common";

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
  },
  {
    id: "phonics",
    title: "Phonics",
    description: "Practice letter sounds and phonics",
    icon: "musical-notes-outline",
    iconColor: "#EC4899",
    backgroundColor: "#FCE7F3",
    route: "/learning/phonics",
    available: false,
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
  },
];

export const wordsByCategory = {
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

export const playerLevels = [
  {
    id: "1",
    title: "Beginner",
    description: "Perfect for beginners",
    minXp: 0,
    maxXp: 100,
  },
  {
    id: "2",
    title: "Intermediate",
    description: "Perfect for intermediate learners",
    minXp: 100,
    maxXp: 300,
  },
  {
    id: "3",
    title: "Advanced",
    description: "Perfect for advanced learners",
    minXp: 300,
    maxXp: 600,
  },
  {
    id: "4",
    title: "Expert",
    description: "Perfect for expert learners",
    minXp: 600,
    maxXp: 1000,
  },
  {
    id: "5",
    title: "Master",
    description: "You've mastered the language!",
    minXp: 1000,
    maxXp: Infinity,
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
};

// Mock data for chore categories
export const choreCategories = [
  { id: "home", title: "Home", icon: "🏠" },
  { id: "school", title: "School", icon: "🏫" },
  { id: "personal", title: "Personal", icon: "👤" },
  { id: "outdoor", title: "Outdoor", icon: "🌳" },
  { id: "other", title: "Other", icon: "📝" },
];

// Mock data for chores by category
export const choresByCategory = {
  home: [
    { id: "clean_room", title: "Clean Room", icon: "bed-outline", xp: 15 },
    { id: "do_dishes", title: "Do Dishes", icon: "water-outline", xp: 10 },
    {
      id: "take_out_trash",
      title: "Take Out Trash",
      icon: "trash-outline",
      xp: 5,
    },
    { id: "vacuum", title: "Vacuum", icon: "flash-outline", xp: 10 },
    { id: "make_bed", title: "Make Bed", icon: "bed-outline", xp: 5 },
    { id: "laundry", title: "Do Laundry", icon: "shirt-outline", xp: 15 },
  ],
  school: [
    { id: "homework", title: "Do Homework", icon: "book-outline", xp: 20 },
    { id: "study", title: "Study", icon: "school-outline", xp: 15 },
    { id: "project", title: "Work on Project", icon: "create-outline", xp: 25 },
    { id: "reading", title: "Reading", icon: "library-outline", xp: 10 },
    { id: "practice", title: "Practice Skills", icon: "bulb-outline", xp: 15 },
  ],
  personal: [
    { id: "exercise", title: "Exercise", icon: "fitness-outline", xp: 15 },
    { id: "meditate", title: "Meditate", icon: "leaf-outline", xp: 10 },
    { id: "journal", title: "Journal", icon: "journal-outline", xp: 10 },
    { id: "read_book", title: "Read a Book", icon: "book-outline", xp: 15 },
    { id: "drink_water", title: "Drink Water", icon: "water-outline", xp: 5 },
  ],
  outdoor: [
    { id: "walk_dog", title: "Walk the Dog", icon: "paw-outline", xp: 10 },
    { id: "gardening", title: "Gardening", icon: "leaf-outline", xp: 15 },
    { id: "mow_lawn", title: "Mow the Lawn", icon: "cut-outline", xp: 20 },
    { id: "car_wash", title: "Wash the Car", icon: "car-outline", xp: 15 },
  ],
  other: [
    {
      id: "help_sibling",
      title: "Help Sibling",
      icon: "people-outline",
      xp: 10,
    },
    { id: "help_parent", title: "Help Parent", icon: "person-outline", xp: 10 },
    { id: "volunteer", title: "Volunteer", icon: "heart-outline", xp: 25 },
    { id: "custom", title: "Custom Chore", icon: "create-outline", xp: 15 },
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

export const circles: Circle[] = [
  {
    id: 1,
    name: "Circle",
    type: "circle",
    description: "A shape with all points at the same distance from the center",
    properties: [
      "All points are the same distance from the center",
      "Has infinite lines of symmetry",
      "Is perfectly round with no corners",
    ],
    image:
      "https://images.unsplash.com/photo-1629624427525-23d41592cce8?q=80&w=1000&auto=format&fit=crop",
  },
  {
    id: 2,
    name: "Oval",
    type: "oval",
    description: "A stretched circle that is longer in one direction",
    properties: [
      "Has 2 lines of symmetry",
      "Is stretched in one direction",
      "Like a flattened circle",
    ],
    image:
      "https://images.unsplash.com/photo-1630395822970-acd6a691d97e?q=80&w=1000&auto=format&fit=crop",
  },
  {
    id: 3,
    name: "Circle with Radius",
    type: "circle",
    description: "A circle with a line from center to edge",
    properties: [
      "The radius is the distance from center to edge",
      "All radii are equal in a circle",
      "The diameter is twice the radius",
    ],
    image:
      "https://images.unsplash.com/photo-1611117775350-ac3950990985?q=80&w=1000&auto=format&fit=crop",
  },
  {
    id: 4,
    name: "Ellipse",
    type: "oval",
    description: "Another name for an oval with two focal points",
    properties: [
      "Has two focal points",
      "Can be drawn with a string and two pins",
      "Used in many real-world objects",
    ],
    image:
      "https://images.unsplash.com/photo-1629624428904-ed9a7a0a2d37?q=80&w=1000&auto=format&fit=crop",
  },
  {
    id: 5,
    name: "Concentric Circles",
    type: "circle",
    description: "Circles that share the same center",
    properties: [
      "All circles share the same center point",
      "The circles have different radii",
      "The circles never intersect",
    ],
    image:
      "https://images.unsplash.com/photo-1597600159211-d6c104f408d1?q=80&w=1000&auto=format&fit=crop",
  },
];

export const rectangles: Rectangle[] = [
  {
    id: 1,
    name: "Square",
    type: "square",
    description: "A shape with 4 equal sides and 4 right angles",
    properties: [
      "All 4 sides are the same length",
      "Has 4 right angles (90 degrees)",
      "Has 4 lines of symmetry",
      "Diagonals bisect each other",
    ],
    image:
      "https://images.unsplash.com/photo-1620332372374-f108c53d2503?q=80&w=1000&auto=format&fit=crop",
  },
  {
    id: 2,
    name: "Rectangle",
    type: "rectangle",
    description:
      "A shape with 4 sides and 4 right angles where opposite sides are equal",
    properties: [
      "Opposite sides are equal in length",
      "Has 4 right angles (90 degrees)",
      "Has 2 lines of symmetry",
      "Diagonals bisect each other",
    ],
    image:
      "https://images.unsplash.com/photo-1587654780291-39c9404d746b?q=80&w=1000&auto=format&fit=crop",
  },
  {
    id: 3,
    name: "Rhombus",
    type: "rectangle",
    description: "A quadrilateral with all sides equal in length",
    properties: [
      "All 4 sides are equal in length",
      "Opposite angles are equal",
      "Diagonals bisect each other at right angles",
      "Has 2 lines of symmetry",
    ],
    image:
      "https://images.unsplash.com/photo-1632928108088-44a03445755b?q=80&w=1000&auto=format&fit=crop",
  },
  {
    id: 4,
    name: "Cube",
    type: "square",
    description: "A 3D shape made of 6 equal squares",
    properties: [
      "Has 6 square faces",
      "Has 8 vertices (corners)",
      "Has 12 edges",
      "All edges are equal in length",
    ],
    image:
      "https://images.unsplash.com/photo-1627384113869-f9d480c4f989?q=80&w=1000&auto=format&fit=crop",
  },
  {
    id: 5,
    name: "Rectangular Prism",
    type: "rectangle",
    description: "A 3D shape made of 6 rectangles",
    properties: [
      "Has 6 rectangular faces",
      "Has 8 vertices (corners)",
      "Has 12 edges",
      "Opposite faces are identical",
    ],
    image:
      "https://images.unsplash.com/photo-1628605760791-31ed7063f376?q=80&w=1000&auto=format&fit=crop",
  },
];

export const triangles: Triangle[] = [
  {
    id: 1,
    name: "Equilateral Triangle",
    type: "equilateral",
    description: "A triangle with all sides and angles equal",
    properties: [
      "All 3 sides are equal in length",
      "All 3 angles are equal (60 degrees each)",
      "Has 3 lines of symmetry",
      "The most regular triangle",
    ],
    image:
      "https://images.unsplash.com/photo-1628605759668-dfa2ee0e99b8?q=80&w=1000&auto=format&fit=crop",
  },
  {
    id: 2,
    name: "Isosceles Triangle",
    type: "isosceles",
    description: "A triangle with two equal sides and two equal angles",
    properties: [
      "Two sides are equal in length",
      "Two angles are equal",
      "Has 1 line of symmetry",
      "Base angles are equal",
    ],
    image:
      "https://images.unsplash.com/photo-1629624428850-534264adcc91?q=80&w=1000&auto=format&fit=crop",
  },
  {
    id: 3,
    name: "Scalene Triangle",
    type: "scalene",
    description: "A triangle with no equal sides and no equal angles",
    properties: [
      "All 3 sides have different lengths",
      "All 3 angles are different",
      "Has no lines of symmetry",
      "Most common type of triangle",
    ],
    image:
      "https://images.unsplash.com/photo-1633008943337-3df6969c0187?q=80&w=1000&auto=format&fit=crop",
  },
  {
    id: 4,
    name: "Right Triangle",
    type: "right",
    description: "A triangle with one right angle (90 degrees)",
    properties: [
      "Has one 90-degree angle",
      "The other two angles sum to 90 degrees",
      "Used in Pythagorean theorem",
      "Can be isosceles or scalene",
    ],
    image:
      "https://images.unsplash.com/photo-1628605759754-74609e7af5cc?q=80&w=1000&auto=format&fit=crop",
  },
  {
    id: 5,
    name: "Obtuse Triangle",
    type: "scalene",
    description: "A triangle with one angle greater than 90 degrees",
    properties: [
      "Has one angle greater than 90 degrees",
      "The other two angles are acute (less than 90 degrees)",
      "Sum of all angles is still 180 degrees",
      "Can be isosceles or scalene",
    ],
    image:
      "https://images.unsplash.com/photo-1629624427491-721a0e8fbbd7?q=80&w=1000&auto=format&fit=crop",
  },
];

export const mathActivities: MathActivity[] = [
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
  },
  {
    id: "addition",
    title: "Addition Adventure",
    description: "Add numbers and solve exciting problems",
    route: "/learning/numbers/addition",
    icon: "add-circle-outline",
    color: "#6366F1",
    backgroundColor: "#EEF2FF",
    difficulty: "medium",
    available: true,
  },
  {
    id: "subtraction",
    title: "Subtraction Quest",
    description: "Learn to subtract with fun challenges",
    route: "/learning/numbers/subtraction",
    icon: "remove-circle-outline",
    color: "#F59E0B",
    backgroundColor: "#FEF3C7",
    difficulty: "medium",
    available: true,
  },
  {
    id: "multiplication",
    title: "Multiplication Magic",
    description: "Discover the magic of multiplication",
    route: "/learning/numbers/multiplication",
    icon: "grid-outline",
    color: "#8B5CF6",
    backgroundColor: "#EDE9FE",
    difficulty: "hard",
    available: false,
  },
  {
    id: "division",
    title: "Division Discovery",
    description: "Explore division through fun games",
    route: "/learning/numbers/division",
    icon: "cut-outline",
    color: "#EC4899",
    backgroundColor: "#FCE7F3",
    difficulty: "hard",
    available: false,
  },
];

export const shapeActivities: ShapeActivity[] = [
  {
    id: "circles",
    title: "Circles & Ovals",
    description: "Learn about circles, ovals and their properties",
    route: "/learning/shapes/circles",
    icon: "ellipse-outline",
    color: "#EC4899",
    backgroundColor: "#FCE7F3",
    difficulty: "easy",
    available: true,
  },
  {
    id: "squares",
    title: "Squares & Rectangles",
    description: "Explore squares, rectangles and their sides",
    route: "/learning/shapes/squares",
    icon: "square-outline",
    color: "#8B5CF6",
    backgroundColor: "#EDE9FE",
    difficulty: "medium",
    available: true,
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
  },
  {
    id: "patterns",
    title: "Shape Patterns",
    description: "Learn to identify and continue patterns",
    route: "/learning/shapes/patterns",
    icon: "grid-outline",
    color: "#F59E0B",
    backgroundColor: "#FEF3C7",
    difficulty: "hard",
    available: false,
  },
  {
    id: "3d",
    title: "3D Shapes",
    description: "Explore cubes, spheres, and more",
    route: "/learning/shapes/3d",
    icon: "cube-outline",
    color: "#6366F1",
    backgroundColor: "#EEF2FF",
    difficulty: "hard",
    available: false,
  },
];
