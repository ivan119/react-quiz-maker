import { z } from 'zod';

export const quizSchema = z.object({
  // TODO: add min of 15 questions after development
  name: z.string().min(3, 'Name must be at least 3 characters'),
  questions: z
    .array(
      z.object({
        question: z.string().min(1, 'Question text is required'),
        answer: z.string().min(1, 'Answer is required'),
      })
    )
    .min(2, 'At least 2 questions is required to save quiz')
    .max(50, 'Quiz can have maximum 50 questions'),
});

export type QuizFormValues = z.infer<typeof quizSchema>;
