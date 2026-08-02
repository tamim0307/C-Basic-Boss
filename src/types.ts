export type Difficulty = 'Easy' | 'Medium' | 'Hard';

export interface TestCase {
  id: string;
  input: string;
  expectedOutput: string;
  isSecret?: boolean;
}

export interface Problem {
  id: string;
  topicId: number;
  missionNumber: number;
  title: string;
  difficulty: Difficulty;
  statement: string;
  inputFormat?: string;
  outputFormat?: string;
  exampleInput?: string;
  exampleOutput?: string;
  constraints?: string;
  starterCode: string;
  testCases: TestCase[];
  hints: string[]; // Hint 1, 2, 3
  solutionCode: string;
  explanationBangla: string;
  explanationEnglishTerms?: string[];
  lineByLineExplanation: { line: string; code: string; explanation: string }[];
  commonMistakes: string[];
  keyConceptSummary: string;
}

export interface TopicResource {
  whatIsIt: string;
  whyUseIt: string;
  syntax: string;
  importantRules: string[];
  commonMistakes: string[];
  quickExamples: { title: string; code: string; note: string }[];
  quickMemoryNotes: string[];
  practiceChecklist: string[];
}

export interface Topic {
  id: number;
  categoryId: number;
  categoryName: string;
  name: string;
  shortDescription: string;
  totalProblems: number;
  difficultyRange: string;
  resource: TopicResource;
  problems: Problem[];
  skillCheckQuestions?: {
    id: string;
    question: string;
    codeSnippet?: string;
    options: string[];
    correctOptionIndex: number;
    explanation: string;
  }[];
}

export interface Category {
  id: number;
  name: string;
  description: string;
  iconName: string;
  topicIds: number[];
}

export interface Badge {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: string;
  unlockedAt?: string;
}

export interface UserProgress {
  totalProblemsSolved: number;
  totalPoints: number;
  completedTopics: number[]; // topic IDs
  topicProgress: Record<number, { solvedCount: number; isCompleted: boolean; skillCheckPassed?: boolean }>; // topicId -> status
  solvedProblems: Record<string, { solvedAt: string; usedHintsCount: number; pointsEarned: number }>; // problemId -> info
  unlockedBadges: string[]; // badge IDs
  finalTest?: {
    score: number;
    totalQuestions: number;
    passed: boolean;
    completedAt: string;
    answers: Record<number, number>;
  };
}

export interface UserProfile {
  uid: string;
  name: string;
  email: string;
  joinedAt: string;
  progress: UserProgress;
  settings?: {
    theme: string;
  };
}
