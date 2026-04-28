import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString } from 'class-validator'

export class GetModelDto {
	@ApiProperty({ example: 'XSAdggvv' })
	@IsString()
	@IsNotEmpty()
	public presetId: string
}
