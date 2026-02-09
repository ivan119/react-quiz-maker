import type { Question, QuestionBankResponse } from '../shared/types/quiz';
import { request } from './apiClient';

export const questionService = {
  getAllQuestions: async (): Promise<Question[]> => {
    return request<Question[]>('/questions');
  },

  postNewQuestions: async (
    questions: Omit<Question, 'id'>[]
  ): Promise<QuestionBankResponse> => {
    return request<QuestionBankResponse>('/questions', {
      method: 'POST',
      body: JSON.stringify(questions),
    });
  },
};
