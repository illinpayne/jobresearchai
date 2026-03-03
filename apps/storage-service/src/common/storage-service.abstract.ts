import { StorageData } from '@/shared/aws.types'

export abstract class Storage {
	public abstract save(data: StorageData): Promise<void>
	public abstract remove(fileName: string): Promise<boolean>
}
