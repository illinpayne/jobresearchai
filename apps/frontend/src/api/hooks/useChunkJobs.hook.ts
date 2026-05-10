import { useQuery } from "@tanstack/react-query";
import type { JobFilterDto } from "../dtos/job-filter.dto";
import type { JobPaginationResponse } from "../generated";
import { getChunkJob } from "../requests/job.req";

export const useChunkJobs = (filter: JobFilterDto) => {
  return useQuery({
    queryKey: ["jobs", filter],
    queryFn: async (): Promise<JobPaginationResponse> => {
      return await getChunkJob(filter);
    },
    retry: 0,
  });
};
