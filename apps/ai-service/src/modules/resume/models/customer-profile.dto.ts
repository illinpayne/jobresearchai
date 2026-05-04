import { IsArray, IsInt, IsString, Max, Min } from 'class-validator'

export class CustomerProfileDto {
	@IsString()
	firstName: string

	@IsString()
	lastName: string

	@IsInt()
	@Min(0)
	@Max(100)
	yearsOld: number

	@IsString()
	location: string

	@IsString()
	predicatedPosition: string

	@IsString()
	currentPosition: string

	@IsInt()
	@Min(0)
	@Max(100)
	resumeScore: number

	@IsString()
	summary: string

	@IsArray()
	@IsString({ each: true })
	achivements: string[] = []

	@IsString()
	level: string

	@IsInt()
	@Min(0)
	expectedSalaryFrom: number

	@IsInt()
	@Min(0)
	expectedSalaryTo: number

	@IsArray()
	@IsString({ each: true })
	tags: string[] = []
}
