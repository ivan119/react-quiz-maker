import { http, HttpResponse } from 'msw';
import type { Quiz, QuizCreateInput } from '../shared/types/quiz';

const QUIZZES_KEY = 'rejd_quizzes';

const getStoredQuizzes = (): Quiz[] => {
  const stored = localStorage.getItem(QUIZZES_KEY);
  return stored ? JSON.parse(stored) : [];
};

const setStoredQuizzes = (quizzes: Quiz[]) => {
  localStorage.setItem(QUIZZES_KEY, JSON.stringify(quizzes));
};

export const handlers = [
  // GET all quizzes
  http.get('/quizzes', () => {
    const quizzes = getStoredQuizzes();
    return HttpResponse.json(quizzes);
  }),

  // GET quiz by id
  http.get('/quizzes/:id', ({ params }) => {
    const { id } = params;
    const quizzes = getStoredQuizzes();
    const quiz = quizzes.find((q) => q.id === id);
    if (!quiz) {
      return new HttpResponse(null, { status: 404 });
    }
    return HttpResponse.json(quiz);
  }),

  // POST create quiz
  http.post('/quizzes', async ({ request }) => {
    const input = (await request.json()) as QuizCreateInput;
    const quizzes = getStoredQuizzes();
    const newQuiz: Quiz = {
      ...input,
      id: crypto.randomUUID(),
    };
    setStoredQuizzes([...quizzes, newQuiz]);
    return HttpResponse.json(newQuiz, { status: 201 });
  }),

  // DELETE quiz
  http.delete('/quizzes/:id', ({ params }) => {
    const { id } = params;
    const quizzes = getStoredQuizzes();
    const filtered = quizzes.filter((q) => q.id !== id);
    setStoredQuizzes(filtered);
    return new HttpResponse(null, { status: 204 });
  }),

  // GET all questions (mocking some default questions or getting from quizzes)
  http.get('/questions', () => {
    const quizzes = getStoredQuizzes();
    const allQuestions = quizzes.flatMap((q) => q.questions);
    return HttpResponse.json(allQuestions);
  }),
];
