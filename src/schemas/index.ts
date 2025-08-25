import { z } from "zod";

export const snippetFormSchema = z.object({
  title: z.string().min(5, "Title is required with atleast 5 characters"),
  description: z
    .string()
    .min(10, "Description is required with atleast 10 characters"),
  tags: z
    .string()
    .min(1, "At least one tag is required")
    .transform((val) =>
      val
        .split(",")
        .map((tag) => tag.trim().toLowerCase())
        .filter(Boolean)
    ),
  language: z.string().optional(),
});

export type SnippetFormInput = z.infer<typeof snippetFormSchema>;
