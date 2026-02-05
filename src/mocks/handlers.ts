import { http, HttpResponse } from 'msw';
import type {
  Quiz,
  QuizCreateInput,
  Question,
  QuizDetail,
} from '../shared/types/quiz';

const QUIZZES_KEY = 'quizzes';
const QUESTIONS_KEY = 'questions';

const getStoredQuizzes = (): Quiz[] => {
  const stored = localStorage.getItem(QUIZZES_KEY);
  return stored ? JSON.parse(stored) : [];
};

const getStoredQuestions = (): Question[] => {
  const stored = localStorage.getItem(QUESTIONS_KEY);
  return stored ? JSON.parse(stored) : [];
};

const setStoredQuizzes = (quizzes: Quiz[]) => {
  localStorage.setItem(QUIZZES_KEY, JSON.stringify(quizzes));
};

const setStoredQuestions = (questions: Question[]) => {
  localStorage.setItem(QUESTIONS_KEY, JSON.stringify(questions));
};

export const handlers = [
  // GET all quizzes (joined with questions for convenience)
  http.get('/quizzes', () => {
    const quizzes = getStoredQuizzes();
    const allQuestions = getStoredQuestions();

    const details: QuizDetail[] = quizzes.map((q) => ({
      ...q,
      questions: allQuestions.filter((question) =>
        q.questionIds.includes(question.id)
      ),
    }));

    return HttpResponse.json(details);
  }),

  // GET quiz by id
  http.get('/quizzes/:id', ({ params }) => {
    const { id } = params;
    const quizzes = getStoredQuizzes();
    const quiz = quizzes.find((q) => q.id === id);

    if (!quiz) {
      return new HttpResponse(null, { status: 404 });
    }

    const allQuestions = getStoredQuestions();
    const detail: QuizDetail = {
      ...quiz,
      questions: allQuestions.filter((q) => quiz.questionIds.includes(q.id)),
    };

    return HttpResponse.json(detail);
  }),

  // POST create quiz
  http.post('/quizzes', async ({ request }) => {
    const input = (await request.json()) as QuizCreateInput;
    const quizzes = getStoredQuizzes();
    const allQuestions = getStoredQuestions();

    // 1. Handle Questions (Recycling check or creation)
    const questionIds = input.questionIds || [];
    const newQuestions: Question[] = [];

    // If full question objects were passed, save them
    if (input.questions) {
      input.questions.forEach((q) => {
        const id = crypto.randomUUID();
        const question = { ...q, id };
        newQuestions.push(question);
        questionIds.push(id);
      });
    }

    // Update global pool
    setStoredQuestions([...allQuestions, ...newQuestions]);

    // 2. Create Quiz
    const newQuiz: Quiz = {
      id: crypto.randomUUID(),
      name: input.name,
      questionIds: questionIds,
    };

    setStoredQuizzes([...quizzes, newQuiz]);

    return HttpResponse.json(newQuiz, { status: 201 });
  }),

  // DELETE quiz (keeps questions in the pool as requested!)
  http.delete('/quizzes/:id', ({ params }) => {
    const { id } = params;
    const quizzes = getStoredQuizzes();
    const filtered = quizzes.filter((q) => q.id !== id);
    setStoredQuizzes(filtered);
    return new HttpResponse(null, { status: 204 });
  }),

  // GET all questions (The Pool)
  http.get('/questions', () => {
    return HttpResponse.json(getStoredQuestions());
  }),
];
