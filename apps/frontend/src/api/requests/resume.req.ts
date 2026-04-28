import type { UploadResumeData } from "@/components/protected/uploads/forms/new-form.schema";
import { instance } from "../instance";

export enum ResumeEndpoints {
  UPLOAD = "/resume/upload",
}

export const uploadResume = async (data: UploadResumeData) => {
  const formData = new FormData();
  formData.append("resume", data.file);
  formData.append("presetId", data.presetId);
  return await instance
    .post<string>(ResumeEndpoints.UPLOAD, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    .then((response) => response.data);
};
