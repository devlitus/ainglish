export interface Lesson {
  title: string;
  description: string;
  level: string;
  topic: string;
  grammar: {
    rules: {
      rule: string;
      explanation: string;
      examples: string[];
    }[];
  };
  spelling: {
    words: {
      word: string;
      pronunciation: string;
      definition: string;
      examples: string[];
    }[];
  };
  exercises: {
    type: 'multiple-choice' | 'fill-blank' | 'translation' | 'pronunciation';
    question: string;
    options?: string[];
    correctAnswer: string;
    explanation: string;
  }[];
}