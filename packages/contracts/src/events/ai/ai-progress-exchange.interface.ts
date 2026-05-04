export interface AiProgressExchangeEventType {
  jobId: string;
  accountId: string;
  statusMessage: string;
}

export interface AiJoinRoomEventType {
  jobId: string;
  accountId: string;
}
