export interface Question {
  id?: string;
  question: string;
  answer: string;
}

export interface Quiz {
  id?: string;
  name: string;
  questions: Question[];
}

export type QuizDetail = Quiz;

export interface QuizCreateInput {
  name: string;
  questions: Omit<Question, 'id'>[];
}

export interface QuestionBankResponse {
  message: string;
  addedCount: number;
  skippedCount: number;
  questions: Question[];
}
