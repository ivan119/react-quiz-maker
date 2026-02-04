export interface Question {
  id: string;
  text: string;
  answer: string;
}

export interface Quiz {
  id: string;
  title: string;
  questions: Question[];
}

export type QuizCreateInput = Omit<Quiz, 'id'>;
export type QuizUpdateInput = Partial<Omit<Quiz, 'id'>>;
