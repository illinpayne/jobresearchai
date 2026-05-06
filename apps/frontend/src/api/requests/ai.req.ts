import type {
  AiPresetsResponse,
  AssignPresetResponse,
  GetModelDto,
  SimplifiedAnalyseJobWithPresetResponse,
} from "../generated";
import { instance } from "../instance";

export enum AiEndpoints {
  MODELS = "/ai/models",
  GET_MODEL = "/ai/get-model",
  JOBS_IN_PROGRESS = "/ai/jobs-in-progress",
}
export const fetchModels = async () => {
  return await instance
    .get<AiPresetsResponse>(AiEndpoints.MODELS)
    .then((response) => response.data);
};

export const getModel = async (dto: GetModelDto) => {
  return await instance
    .post<AssignPresetResponse>(AiEndpoints.GET_MODEL, dto)
    .then((response) => response.data);
};

export const getJobsInProgress = async () => {
  return await instance
    .get<SimplifiedAnalyseJobWithPresetResponse>(AiEndpoints.JOBS_IN_PROGRESS)
    .then((response) => response.data);
};
