import type { Quiz, QuizCreateInput, QuizDetail } from '../shared/types/quiz';
import { request } from './apiClient';

export const quizService = {
  createQuiz: async (input: QuizCreateInput): Promise<Quiz> => {
    return request<Quiz>('/quizzes', {
      method: 'POST',
      body: JSON.stringify(input),
    });
  },
  getAllQuizzes: async (): Promise<QuizDetail[]> => {
    return request<QuizDetail[]>('/quizzes');
  },

  getQuizById: async (id: string): Promise<QuizDetail | undefined> => {
    return request<QuizDetail>(`/quizzes/${id}`);
  },

  updateQuiz: async (id: string, input: QuizCreateInput): Promise<Quiz> => {
    return request<Quiz>(`/quizzes/${id}`, {
      method: 'PUT',
      body: JSON.stringify(input),
    });
  },

  deleteQuiz: async (id: string): Promise<void> => {
    await request<void>(`/quizzes/${id}`, {
      method: 'DELETE',
    });
  },

  validateQuizName: async (
    name: string,
    excludeId?: string
  ): Promise<{ isTaken: boolean }> => {
    const quizzes = await quizService.getAllQuizzes();
    const isTaken = quizzes.some(
      (q) =>
        q.name.trim().toLowerCase() === name.trim().toLowerCase() &&
        q.id !== excludeId
    );
    return { isTaken };
  },
};
