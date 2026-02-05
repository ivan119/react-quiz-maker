import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import {
    Typography, Box, Button, Paper, Divider,
    Accordion, AccordionSummary, AccordionDetails,
} from "@mui/material";
import { Add as AddIcon, Delete as DeleteIcon, ExpandMore as ExpandMoreIcon } from "@mui/icons-material";
import { Form, FormInput } from "../ui";
import { quizSchema, type QuizFormValues } from "../../lib/validators/quiz.schema";

type Props = {
    defaultValues?: QuizFormValues;
    onSubmit: (values: QuizFormValues) => Promise<void> | void;
    submitLabel?: string;
    title?: string;
};

const QuizForm = ({
                      defaultValues = { name: "", questions: [{ question: "", answer: "" }] },
                      onSubmit,
                      submitLabel = "Save Quiz",
                      title = "Quiz",
                  }: Props) => {
    const [expanded, setExpanded] = useState<string | false>("panel0");

    const methods = useForm<QuizFormValues>({
        resolver: zodResolver(quizSchema),
        defaultValues,
    });

    const { control, formState: { isSubmitting }, watch } = methods;

    const { fields, append, remove } = useFieldArray({
        control,
        name: "questions",
    });

    const questionsValues = watch("questions");

    const handleAccordionChange =
        (panel: string) => (_: React.SyntheticEvent, isExpanded: boolean) => {
            setExpanded(isExpanded ? panel : false);
        };

    return (
        <Box sx={{ maxWidth: 800, mx: "auto", py: 4 }}>
            <Typography variant="h4" sx={{ fontWeight: "bold", mb: 4 }}>
                {title}
            </Typography>

            <Paper sx={{ p: 4, borderRadius: 3, boxShadow: 3 }}>
                <Form<QuizFormValues> onSubmit={onSubmit} useFormMethods={methods}>
                    <FormInput
                        name="name"
                        control={control}
                        label="Quiz Name"
                        placeholder="General Knowledge"
                    />

                    <Divider sx={{ my: 4 }} />

                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                        <Typography variant="h6">Add Questions ({fields.length})</Typography>

                        <Button
                            startIcon={<AddIcon />}
                            variant="contained"
                            size="small"
                            onClick={() => {
                                append({ question: "", answer: "" });
                                setExpanded(`panel${fields.length}`);
                            }}
                        >
                            Add Question
                        </Button>
                    </Box>

                    {fields.map((field, index) => (
                        <Accordion
                            key={field.id}
                            expanded={expanded === `panel${index}`}
                            onChange={handleAccordionChange(`panel${index}`)}
                            sx={{
                                mb: 1,
                                borderRadius: "8px !important",
                                "&:before": { display: "none" },
                                border: "1px solid",
                                borderColor: "divider",
                            }}
                        >
                            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                                    {questionsValues[index]?.question || `New Question #${index + 1}`}
                                </Typography>
                            </AccordionSummary>

                            <AccordionDetails>
                                <FormInput
                                    name={`questions.${index}.question`}
                                    control={control}
                                    label="Question Text"
                                    multiline
                                    rows={2}
                                />
                                <FormInput
                                    name={`questions.${index}.answer`}
                                    control={control}
                                    label="Correct Answer"
                                />

                                {fields.length > 1 && (
                                    <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                                        <Button
                                            size="small"
                                            color="error"
                                            startIcon={<DeleteIcon />}
                                            onClick={() => remove(index)}
                                        >
                                            Remove Question
                                        </Button>
                                    </Box>
                                )}
                            </AccordionDetails>
                        </Accordion>
                    ))}

                    <Box sx={{ mt: 4, display: "flex", gap: 2 }}>
                        <Button variant="contained" type="submit" disabled={isSubmitting} size="large">
                            {isSubmitting ? "Saving..." : submitLabel}
                        </Button>
                    </Box>
                </Form>
            </Paper>
        </Box>
    );
};

export default QuizForm;
