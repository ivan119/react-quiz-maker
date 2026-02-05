import type { Quiz, QuizCreateInput } from '../shared/types/quiz';
import { request } from './apiClient';

export const quizService = {
  createQuiz: async (input: QuizCreateInput): Promise<Quiz> => {
    return request<Quiz>('/quizzes', {
      method: 'POST',
      body: JSON.stringify(input),
    });
  },
  getAllQuizzes: async (): Promise<Quiz[]> => {
    return request<Quiz[]>('/quizzes');
  },

  getQuizById: async (id: string): Promise<Quiz | undefined> => {
    return request<Quiz>(`/quizzes/${id}`);
  },

  deleteQuiz: async (id: string): Promise<void> => {
    await request<void>(`/quizzes/${id}`, {
      method: 'DELETE',
    });
  },
};
