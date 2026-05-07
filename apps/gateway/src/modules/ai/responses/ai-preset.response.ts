import { ApiProperty } from '@nestjs/swagger'

export class AiSecuredPresetResponse {
	@ApiProperty({ type: String, default: 'XAjerty' })
	id: string
	@ApiProperty({ type: String, default: 'Junkie 1.0' })
	name: string
	@ApiProperty({ type: String, default: 'Ai model possibility' })
	description: string
	@ApiProperty({ type: Number, default: 5 })
	stars: number
	@ApiProperty({ type: Number, default: 10 })
	usageCredits: number
	@ApiProperty({ type: String, default: 'Free/Pro' })
	paidTier: string
}

export class AiSecuredPresetsResponse {
	@ApiProperty({ type: [AiSecuredPresetResponse] })
	presets: AiSecuredPresetResponse[]
	@ApiProperty({ type: [String], default: ['presetId1', 'presetId2'] })
	ownedPresetIds: string[]
}

export class AssignPresetResponse {
	@ApiProperty({ type: Boolean, default: true })
	status: boolean
}
