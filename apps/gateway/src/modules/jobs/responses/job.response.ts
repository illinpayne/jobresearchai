import { ApiProperty } from '@nestjs/swagger'

import { PaginationMetadata } from '@/common/pagination/pagination-metadata'

export class JobResponse {
	@ApiProperty({ type: String, default: 'eya13Fgbs' })
	id: string
	@ApiProperty({ type: String, default: 'IT Manager' })
	title: string
	@ApiProperty({ type: String, default: 'We are looking for an IT Manager' })
	description: string
	@ApiProperty({ type: Number, default: 10000, nullable: true })
	salaryFrom?: number
	@ApiProperty({ type: Number, default: 100000, nullable: true })
	salaryTo?: number
	@ApiProperty({ type: String, default: 'Remote', nullable: true })
	location?: string
	@ApiProperty({ type: String, default: 'Upwork.com' })
	sourceUrl: string
	@ApiProperty({ type: Date })
	createdAt: Date
}

export class JobPaginationResponse {
	@ApiProperty({ type: [JobResponse] })
	data: JobResponse[]
	@ApiProperty({ type: PaginationMetadata })
	metadata: PaginationMetadata
}
