import { ApiProperty } from '@nestjs/swagger'

export class PaginationMetadata {
	@ApiProperty({ type: Number })
	total: number
	@ApiProperty({ type: Number })
	lastPage: number
	@ApiProperty({ type: Number })
	currentPage: number
	@ApiProperty({ type: Number })
	perPage: number
	@ApiProperty({ type: Number, nullable: true })
	prev?: number
	@ApiProperty({ type: Number, nullable: true })
	next?: number
}
