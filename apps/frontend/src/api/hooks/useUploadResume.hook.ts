import { type UseMutationOptions, useMutation } from '@tanstack/react-query';
import type { AxiosError } from 'axios';
import type { UploadResumeData } from '@/components/protected/uploads/forms/new-form.schema';
import type { ApiError } from '@/shared/api-error.types';
import { uploadResume } from '../requests/resume.req';

export const useUploadResume = (
  options?: Omit<UseMutationOptions<string, AxiosError<ApiError>, UploadResumeData>, 'mutationKey' | 'mutationFn'>,
) =>
  useMutation({
    mutationKey: ['logout'],
    mutationFn: (data: UploadResumeData) => uploadResume(data),
    ...options,
  });
