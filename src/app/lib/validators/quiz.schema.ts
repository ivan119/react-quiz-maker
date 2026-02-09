import { z } from 'zod';

export const questionSchema = z.object({
  id: z.string().optional(),
  question: z.string().min(3, 'Question must be at least 3 characters'),
  answer: z.string().min(1, 'Answer must be at least 1 character'),
});

export const quizSchema = z.object({
  // TODO: add min of 15 questions after development
  id: z.string().optional(),
  name: z.string().min(3, 'Name must be at least 3 characters'),
  questions: z
    .array(questionSchema)
    .min(1, 'At least 1 question is required to save quiz'),
});

export type QuizFormValues = z.infer<typeof quizSchema>;
export type QuestionFormValues = z.infer<typeof questionSchema>;
