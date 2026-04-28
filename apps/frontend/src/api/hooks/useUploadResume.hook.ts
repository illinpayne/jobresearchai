import { type UseMutationOptions, useMutation } from "@tanstack/react-query";
import type { UploadResumeData } from "@/components/protected/uploads/forms/new-form.schema";
import { uploadResume } from "../requests/resume.req";

export const useUploadResume = (
  options?: Omit<
    UseMutationOptions<string, unknown, UploadResumeData>,
    "mutationKey" | "mutationFn"
  >,
) =>
  useMutation({
    mutationKey: ["logout"],
    mutationFn: (data: UploadResumeData) => uploadResume(data),
    ...options,
  });
