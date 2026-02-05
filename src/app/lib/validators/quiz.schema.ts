import { z } from "zod";

export const quizSchema = z.object({
    name: z.string().min(3, "Name must be at least 3 characters"),
    questions: z
        .array(
            z.object({
                question: z.string().min(1, "Question text is required"),
                answer: z.string().min(1, "Answer is required"),
            })
        )
        .min(1, "At least one question is required"),
});

export type QuizFormValues = z.infer<typeof quizSchema>;
