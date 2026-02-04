import { quizService } from './quiz.service';
import { questionService } from './question.service';

export * from './apiClient';
export * from './quiz.service';
export * from './question.service';
export * from '../shared/types/quiz';

// Unified api object for convenience
export const api = {
  ...quizService,
  ...questionService,
};
