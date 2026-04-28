import z from "zod";

export const MAX_FILE_SIZE = 5 * 1024 * 1024;
export const ACCEPTED_FILE_TYPES = ["application/pdf"];

export const newFormSchema = z.object({
  aiModel: z.string().nonempty(),
  document: z
    .instanceof(File, { message: "Please select a file." })
    .refine((file) => file.size <= MAX_FILE_SIZE, {
      message: "File size must be less than 5MB.",
    })
    .refine((file) => ACCEPTED_FILE_TYPES.includes(file.type), {
      message: "Only PDF files are accepted.",
    }),
});

export type NewFormSchemaValue = z.infer<typeof newFormSchema>;

export interface UploadResumeData {
  presetId: string;
  file: File;
}
