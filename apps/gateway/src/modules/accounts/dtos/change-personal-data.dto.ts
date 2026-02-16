import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsOptional, IsString } from 'class-validator'

export class ChangePersonalDataDto {
	@ApiProperty({ example: 'Tony' })
	@IsString({ message: 'First name must be a string' })
	@IsNotEmpty({ message: 'First name must not be empty' })
	@IsOptional()
	firstName: string

	@ApiProperty({ example: 'Soprano' })
	@IsString({ message: 'Second name must be a string' })
	@IsNotEmpty()
	@IsOptional()
	secondName: string
}
