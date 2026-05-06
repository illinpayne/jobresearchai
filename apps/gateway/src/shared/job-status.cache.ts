import { EventStatusCode } from '@jrai/contracts'

export interface JobStatusCacheValue {
	email: string
	lastMessage: string
	status: EventStatusCode
}
