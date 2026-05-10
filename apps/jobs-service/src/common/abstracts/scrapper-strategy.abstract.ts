import { CreateVacancyEventType } from '@jrai/contracts'
import { CreateJobRequest } from '@jrai/contracts/gen/job'

export interface ScrapperPayload extends CreateVacancyEventType {}

export interface ScrappedJob extends Omit<CreateJobRequest, 'accountId'> {}

export abstract class ScrapperStrategy {
	public abstract scrape(payload: ScrapperPayload): Promise<ScrappedJob[]>
}
