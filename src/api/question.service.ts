import type { Question } from '../shared/types/quiz';
import {
  USE_LOCAL_STORAGE,
  STORAGE_KEYS,
  getStored,
  request,
} from './apiClient';

export const questionService = {
  getAllQuestions: async (): Promise<Question[]> => {
    if (USE_LOCAL_STORAGE) {
      console.log('getAllQuestions Using local storage');
      return getStored(STORAGE_KEYS.QUESTIONS, []);
    }
    return request<Question[]>('/questions');
  },
};
