import { http, HttpResponse } from 'msw';
import type { Quiz, QuizCreateInput, Question } from '../shared/types/quiz';

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
  http.get('/quizzes', () => {
    return HttpResponse.json(getStoredQuizzes());
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

    const newQuestions: Question[] = [];

    // Process questions: Generate new IDs ensuring they are unique to this quiz (Copy behavior)
    if (input.questions) {
      input.questions.forEach((q:Question) => {
        const id = crypto.randomUUID();
        const question = { ...q, id };
        newQuestions.push(question);
      });
    }

    // Create Quiz with EMBEDDED questions
    const newQuiz: Quiz = {
      id: crypto.randomUUID(),
      name: input.name,
      questions: newQuestions,
    };

    setStoredQuizzes([...quizzes, newQuiz]);

    return HttpResponse.json(newQuiz, { status: 201 });
  }),

  // PUT update quiz
  http.put('/quizzes/:id', async ({ params, request }) => {
    const { id } = params;
    const input = (await request.json()) as QuizCreateInput;
    const quizzes = getStoredQuizzes();
    const quizIndex = quizzes.findIndex((q) => q.id === id);
    if (!id || typeof id !== 'string') {
      return new HttpResponse(null, { status: 400 });
    }
    if (quizIndex === -1) return new HttpResponse(null, { status: 404 });

    const updatedQuestions = input.questions.map((q: Question) => ({
      question: q.question,
      answer: q.answer,
      // If the frontend is passing id from previous question keep it!
      // if not, that means we add a new question, so we create new Id!
      id: q.id || crypto.randomUUID(),
    }));

    const updatedQuiz = {
      id,
      name: input.name,
      questions: updatedQuestions,
    };

    quizzes[quizIndex] = updatedQuiz;
    setStoredQuizzes(quizzes);
    return HttpResponse.json(updatedQuiz);
  }),
  // DELETE quiz (keeps questions in the pool as requested!)
  http.delete('/quizzes/:id', ({ params }) => {
    const { id } = params;
    const quizzes = getStoredQuizzes();
    const filtered = quizzes.filter((q) => q.id !== id);
    setStoredQuizzes(filtered);
    return new HttpResponse(null, { status: 204 });
  }),

  // GET all questions (The Pool) for recycling
  http.get('/questions', () => {
    return HttpResponse.json(getStoredQuestions());
  }),

  // POST create question (API for independent question creation)
  http.post('/questions', async ({ request }) => {
    const input = (await request.json()) as Omit<Question, 'id'>[];
    const questions = getStoredQuestions();

    const newQuestions = input.map((q) => ({
      ...q,
      id: crypto.randomUUID(),
    }));

    setStoredQuestions([...questions, ...newQuestions]);

    return HttpResponse.json(newQuestions, { status: 201 });
  }),
];
