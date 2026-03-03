export enum StorageFileType {
	Avatar = 'avatars'
}

export interface StorageQueueData {
	bufferArray: Uint8Array
	mimetype: string
	fileName: string
}

export interface StorageData {
	data: Buffer<ArrayBuffer>
	mimetype: string
	fileName: string
}

export const S3_CLIENT = 'S3_CLIENT' as const
