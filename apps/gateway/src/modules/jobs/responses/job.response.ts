import { ApiProperty } from '@nestjs/swagger'

import { PaginationMetadata } from '@/common/pagination/pagination-metadata'

export class JobResponse {
	@ApiProperty({ type: String, default: 'eya13Fgbs' })
	id: string
	@ApiProperty({ type: String, default: 'IT Manager' })
	title: string
	@ApiProperty({ type: String, default: 'Job Research LLC' })
	company: string
	@ApiProperty({ type: String, default: 'IT Manager' })
	position: string
	@ApiProperty({ type: String, default: 'We are looking for an IT Manager' })
	description: string
	@ApiProperty({
		type: String,
		default: '10 000 - 15 000 грн',
		nullable: true
	})
	salary: string
	@ApiProperty({ type: String, default: 'Remote', nullable: true })
	location?: string
	@ApiProperty({ type: String, default: 'Upwork.com' })
	sourceUrl: string
}

export class JobPaginationResponse {
	@ApiProperty({ type: [JobResponse] })
	data: JobResponse[]
	@ApiProperty({ type: PaginationMetadata })
	meta: PaginationMetadata
}

export class JobFilterDtoResponse {
	@ApiProperty({
		type: [String],
		description: 'List of unique job positions/titles available',
		example: ['Full-stack Developer', '.NET Developer', 'Node.js Developer']
	})
	positions: string[]

	@ApiProperty({
		type: [String],
		description: 'List of unique locations available',
		example: ['Kyiv', 'Lviv', 'Remote']
	})
	locations: string[]

	@ApiProperty({
		type: [String],
		description: 'List of derived job boards or services',
		example: ['work.ua', 'other']
	})
	services: string[]

	@ApiProperty({
		type: Number,
		description: 'The minimum salary value found in the current dataset',
		example: 15000
	})
	salaryFrom: number

	@ApiProperty({
		type: Number,
		description: 'The maximum salary value found in the current dataset',
		example: 120000
	})
	salaryTo: number
}
