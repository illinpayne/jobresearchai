export interface CreateVacancyEventType {
  accountId: string;
  tags: string[];
  location?: string;
  limit: number;
}
