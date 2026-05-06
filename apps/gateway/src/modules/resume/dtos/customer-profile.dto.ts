import { ApiProperty } from '@nestjs/swagger'
import { IsArray, IsInt, IsNumber, IsString, Max, Min } from 'class-validator'

export class CustomerProfileDto {
	@ApiProperty({
		description: 'Unique identifier for the resume profile',
		example: 'HnzoaXTkHVsgM3ufvSBEo'
	})
	@IsString()
	id: string

	@ApiProperty({
		description: 'First name of the candidate',
		example: 'STANISLAV'
	})
	@IsString()
	firstName: string

	@ApiProperty({
		description: 'Last name of the candidate',
		example: 'TARNOHURSKYI'
	})
	@IsString()
	lastName: string

	@ApiProperty({
		description: 'Age of the candidate in years',
		example: 20
	})
	@IsInt()
	@Min(0)
	yearsOld: number

	@ApiProperty({
		description: 'Geographical location of the candidate',
		example: 'Ukraine'
	})
	@IsString()
	location: string

	@ApiProperty({
		description: 'AI-predicted best fit job title',
		example: 'Senior Full Stack Developer'
	})
	@IsString()
	predicatedPosition: string

	@ApiProperty({
		description: 'Current or most recent job title',
		example: 'Full Stack Developer'
	})
	@IsString()
	currentPosition: string

	@ApiProperty({
		description: 'Overall AI evaluated score of the resume (0-100)',
		example: 85,
		minimum: 0,
		maximum: 100
	})
	@IsInt()
	@Min(0)
	@Max(100)
	resumeScore: number

	@ApiProperty({
		description: 'Comprehensive professional summary',
		example:
			'A dedicated Full-Stack Developer with over 4 years of experience specializing in building robust web solutions...'
	})
	@IsString()
	summary: string

	@ApiProperty({
		description: 'List of notable professional achievements',
		type: [String],
		example: [
			'Developed over five full-stack applications contributing to healthcare digital solutions.',
			'Developed a comprehensive Node.js CLI tool that automates the full-stack development and deployment process...'
		]
	})
	@IsArray()
	@IsString({ each: true })
	achivements: string[] // Note: Retained spelling from your JSON, but consider renaming to 'achievements'

	@ApiProperty({
		description: 'Assessed seniority level',
		example: 'Junior - Middle Full Stack'
	})
	@IsString()
	level: string

	@ApiProperty({
		description: 'Minimum expected salary',
		example: 18000
	})
	@IsNumber()
	@Min(0)
	expectedSalaryFrom: number

	@ApiProperty({
		description: 'Maximum expected salary',
		example: 35000
	})
	@IsNumber()
	@Min(0)
	expectedSalaryTo: number

	@ApiProperty({
		description: 'Extracted technical skills and keywords',
		type: [String],
		example: [
			'Full Stack Development',
			'React',
			'Node.js',
			'.NET',
			'Backend Development',
			'API Development',
			'Cloud Deployment'
		]
	})
	@IsArray()
	@IsString({ each: true })
	tags: string[]
}
