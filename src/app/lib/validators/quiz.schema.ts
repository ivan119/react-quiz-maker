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
    .min(2, 'At least 2 questions is required to save quiz')
    .max(50, 'Quiz can have maximum 50 questions'),
});

export type QuizFormValues = z.infer<typeof quizSchema>;
export type QuestionFormValues = z.infer<typeof questionSchema>;
