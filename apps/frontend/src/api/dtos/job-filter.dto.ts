import type { PaginationOptions } from './pagination.dto';

export interface JobFilterDto {
  chunk: PaginationOptions;
  positions?: string[];
  salaryFrom?: number;
  salaryTo?: number;
  locations?: string[];
  services?: string[];
}
