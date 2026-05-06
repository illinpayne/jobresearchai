import { ApiProperty } from '@nestjs/swagger'

export class AnalyseJobInProgressDto {
	@ApiProperty({ type: String, description: 'eye1243..' })
	id: string
	@ApiProperty({ type: String, description: 'WAITING' })
	status: string
	@ApiProperty({ type: String, description: 'Junkie 1.0' })
	presetName: string
}

export class SimplifiedAnalyseJobWithPresetResponse {
	@ApiProperty({ type: [AnalyseJobInProgressDto] })
	jobs: AnalyseJobInProgressDto[]
}
