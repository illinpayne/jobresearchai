import { EventStatusCode } from "./events";

export enum JobStatus {
  WAITING = "WAITING",
  DONE = "DONE",
  INQUEUE = "INQUEUE",
  CANCELLED = "CANCELLED",
}

export interface JobJoinedRoom {
  jobId: string;
  lastMessage: string;
  status: EventStatusCode;
}

export interface JobUpdatesRoom {
  jobId: string;
  lastMessage: string;
  status: EventStatusCode;
}

export const JobStatusMapper: Record<EventStatusCode, JobStatus> = {
  [EventStatusCode.WAITING]: JobStatus.WAITING,
  [EventStatusCode.DONE]: JobStatus.DONE,
  [EventStatusCode.CANCELLED]: JobStatus.CANCELLED,
  [EventStatusCode.INQUEUE]: JobStatus.INQUEUE,
};
