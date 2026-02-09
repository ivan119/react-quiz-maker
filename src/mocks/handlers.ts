import { http, HttpResponse } from 'msw';
import type {
  Quiz,
  QuizCreateInput,
  Question,
  SanitizedQuiz,
  SanitizedQuestion,
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

const isQuizNameTaken = (name: string, excludeId?: string): boolean => {
  const quizzes = getStoredQuizzes();
  return quizzes.some(
    (q) =>
      q.name.trim().toLowerCase() === name.trim().toLowerCase() &&
      q.id !== excludeId
  );
};

const checkIsAdmin = (request: Request) => {
  // Just for a demo
  const auth = request.headers.get('Authorization');
  return auth === 'Bearer admin';
};

const sanitizeQuiz = (quiz: Quiz): SanitizedQuiz => ({
  ...quiz,
  questions: quiz.questions.map(({ answer, ...q }) => q as SanitizedQuestion),
});

const sanitizeQuestion = ({ answer, ...q }: Question): SanitizedQuestion => q;

export const handlers = [
  http.get('/quizzes', ({ request }) => {
    const quizzes = getStoredQuizzes();
    if (checkIsAdmin(request)) return HttpResponse.json(quizzes);

    return HttpResponse.json(quizzes.map(sanitizeQuiz));
  }),

  // GET quiz by id
  http.get('/quizzes/:id', ({ params, request }) => {
    const { id } = params;
    const quizzes = getStoredQuizzes();
    const quiz = quizzes.find((q) => q.id === id);

    if (!quiz) {
      return new HttpResponse(null, { status: 404 });
    }

    if (checkIsAdmin(request)) return HttpResponse.json(quiz);

    return HttpResponse.json(sanitizeQuiz(quiz));
  }),

  // POST create quiz
  http.post('/quizzes', async ({ request }) => {
    const input = (await request.json()) as QuizCreateInput;
    const quizzes = getStoredQuizzes();

    if (isQuizNameTaken(input.name)) {
      return HttpResponse.json(
        { message: `A quiz with the name "${input.name}" already exists.` },
        { status: 400 }
      );
    }

    const newQuestions: Question[] = [];

    // Process questions: Generate new IDs ensuring they are unique to this quiz (Copy behavior)
    if (input.questions) {
      input.questions.forEach((q: Question) => {
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

    if (isQuizNameTaken(input.name, id)) {
      return HttpResponse.json(
        {
          message: `Another quiz with the name "${input.name}" already exists.`,
        },
        { status: 400 }
      );
    }

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
  http.get('/questions', ({ request }) => {
    const questions = getStoredQuestions();
    if (checkIsAdmin(request)) return HttpResponse.json(questions);

    return HttpResponse.json(questions.map(sanitizeQuestion));
  }),

  // POST create question (API for independent question creation)
  http.post('/questions', async ({ request }) => {
    const input = (await request.json()) as Omit<Question, 'id'>[];
    const questions = getStoredQuestions();

    const added: Question[] = [];
    let skippedCount = 0;

    input.forEach((q) => {
      const isDuplicate = questions.some(
        (eq) =>
          eq.question.trim().toLowerCase() === q.question.trim().toLowerCase()
      );

      if (!isDuplicate) {
        const newQuestion = {
          ...q,
          id: crypto.randomUUID(),
        };
        added.push(newQuestion);
      } else {
        skippedCount++;
      }
    });

    if (added.length > 0) {
      setStoredQuestions([...questions, ...added]);
    }

    return HttpResponse.json(
      {
        message:
          added.length > 0
            ? `Successfully processed bank update.`
            : `No new questions were added to the bank.`,
        addedCount: added.length,
        skippedCount,
        questions: added,
      },
      { status: 201 }
    );
  }),
  // POST validate quiz
  http.post('/quizzes/:id/validate', async ({ params, request }) => {
    const { id } = params;
    const body = (await request.json()) as { answers: Record<string, string> };
    const quizzes = getStoredQuizzes();
    const quiz = quizzes.find((q) => q.id === id);

    if (!quiz) {
      return new HttpResponse(null, { status: 404 });
    }

    const { answers } = body;
    const results = quiz.questions.map((q) => {
      const userAnswer = answers[q.id || ''] || '';
      const isCorrect =
        userAnswer.trim().toLowerCase() === q.answer.trim().toLowerCase();
      return {
        questionId: q.id || '',
        isCorrect,
        correctAnswer: q.answer,
        userAnswer,
      };
    });

    const score = results.filter((r) => r.isCorrect).length;

    return HttpResponse.json({
      score,
      totalQuestions: quiz.questions.length,
      results,
    });
  }),
];
