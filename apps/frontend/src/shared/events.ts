export enum EventStatusCode {
  WAITING = 200,
  DONE = 300,
  INQUEUE = 100,
  CANCELLED = 400,
}

export interface AiProgressExchangeEventType {
  jobId: string;
  lastMessage: string;
  status: EventStatusCode;
}
