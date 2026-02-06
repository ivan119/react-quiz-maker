import type { Question } from '../shared/types/quiz';
import { request } from './apiClient';

export const questionService = {
  getAllQuestions: async (): Promise<Question[]> => {
    return request<Question[]>('/questions');
  },

  postNewQuestions: async (
    questions: Omit<Question, 'id'>[]
  ): Promise<Question[]> => {
    return request<Question[]>('/questions', {
      method: 'POST',
      body: JSON.stringify(questions),
    });
  },
};
