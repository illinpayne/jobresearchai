export enum EventStatusCode {
  WAITING = 200,
  DONE = 300,
  INQUEUE = 100,
  CANCELLED = 400,
}

export enum JobStatus {
  WAITING = 'WAITING',
  DONE = 'DONE',
  INQUEUE = 'INQUEUE',
  CANCELLED = 'CANCELLED',
}

export interface AiProgressExchangeEventType {
  jobId: string;
  lastMessage: string;
  status: EventStatusCode;
}

export interface AiJoinRoomEventType {
  jobId: string;
  accountEmail: string;
}

export const JobStatusMapper: Record<EventStatusCode, JobStatus> = {
  [EventStatusCode.WAITING]: JobStatus.WAITING,
  [EventStatusCode.DONE]: JobStatus.DONE,
  [EventStatusCode.CANCELLED]: JobStatus.CANCELLED,
  [EventStatusCode.INQUEUE]: JobStatus.INQUEUE,
};
