import type { Quiz, QuizCreateInput } from '../shared/types/quiz';
import {
  USE_LOCAL_STORAGE,
  STORAGE_KEYS,
  getStored,
  setStored,
  request,
} from './apiClient';

export const quizService = {
  createQuiz: async (input: QuizCreateInput): Promise<Quiz> => {
    if (USE_LOCAL_STORAGE) {
      const quizzes = await quizService.getAllQuizzes();
      const newQuiz: Quiz = {
        ...input,
        id: crypto.randomUUID(),
      };
      setStored(STORAGE_KEYS.QUIZZES, [...quizzes, newQuiz]);
      return newQuiz;
    }

    return request<Quiz>('/quizzes', {
      method: 'POST',
      body: JSON.stringify(input),
    });
  },
  getAllQuizzes: async (): Promise<Quiz[]> => {
    if (USE_LOCAL_STORAGE) {
      console.log('Using local storage');
      return getStored(STORAGE_KEYS.QUIZZES, []);
    }
    return request<Quiz[]>('/quizzes');
  },

  getQuizById: async (id: string): Promise<Quiz | undefined> => {
    if (USE_LOCAL_STORAGE) {
      const quizzes = await quizService.getAllQuizzes();
      return quizzes.find((q) => q.id === id);
    }
    return request<Quiz>(`/quizzes/${id}`);
  },

  deleteQuiz: async (id: string): Promise<void> => {
    if (USE_LOCAL_STORAGE) {
      const quizzes = await quizService.getAllQuizzes();
      const filtered = quizzes.filter((q) => q.id !== id);
      setStored(STORAGE_KEYS.QUIZZES, filtered);
      return;
    }

    await request<void>(`/quizzes/${id}`, {
      method: 'DELETE',
    });
  },
};
