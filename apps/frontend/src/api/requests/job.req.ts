import type { JobFilterDto } from "../dtos/job-filter.dto";
import type { JobFilterDtoResponse, JobPaginationResponse } from "../generated";
import { instance } from "../instance";

export enum JobEndpoints {
  GET_CHUNK = "/jobs/chunk",
  GET_FILTER = "/jobs/filters",
}

export const getChunkJob = async (filter: JobFilterDto) => {
  return await instance
    .get<JobPaginationResponse>(JobEndpoints.GET_CHUNK, {
      params: {
        page: filter.chunk.page,
        limit: filter.chunk.limit,
        positions: filter.positions,
        locations: filter.locations,
        services: filter.services,
        salaryFrom: filter.salaryFrom,
        salaryTo: filter.salaryTo,
      },
      paramsSerializer: {
        indexes: null,
      },
    })
    .then((response) => response.data);
};

export const getJobFilter = async () => {
  return await instance
    .get<JobFilterDtoResponse>(JobEndpoints.GET_FILTER)
    .then((response) => response.data);
};
