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

export const passwordSchema = z
  .object({
    currentPassword: z.string(),
    newPassword: z
      .string()
      .min(8, { message: "Password must be atleast 8 characters" })
      .regex(/[A-Z]/, {
        message: "Password must include atleast one uppercase letter",
      })
      .regex(/[a-z]/, {
        message: "Password must include atleast one lowercase letter",
      })
      .regex(/[0-9]/, {
        message: "Password must include atleast one number",
      })
      .regex(/[^a-zA-z0-9]/, {
        message: "Password must include atleast one special character",
      }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Password do not match",
    path: ["confirmPassword"],
  });

export type passwordFormValues = z.infer<typeof passwordSchema>;
