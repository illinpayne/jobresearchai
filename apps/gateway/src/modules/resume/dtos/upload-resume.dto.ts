import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString } from 'class-validator'

export class UploadResumeDto {
	@ApiProperty({ type: String, description: 'Resume file' })
	@IsString()
	@IsNotEmpty()
	presetId: string
}
