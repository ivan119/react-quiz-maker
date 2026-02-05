export interface Question {
  id: string;
  question: string;
  answer: string;
}

export interface Quiz {
  id: string;
  name: string;
  questionIds: string[];
}
export interface QuizDetail extends Omit<Quiz, 'questionIds'> {
  questions: Question[];
}

export type QuizCreateInput = Omit<Quiz, 'id'> & {
  questions?: Omit<Question, 'id'>[];
};
