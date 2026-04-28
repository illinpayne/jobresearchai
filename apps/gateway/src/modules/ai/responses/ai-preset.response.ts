import { ApiProperty } from '@nestjs/swagger'

export class AiPresetResponse {
	@ApiProperty({ type: String, default: 'XAjerty' })
	id: string
	@ApiProperty({ type: String, default: 'Junkie 1.0' })
	name: string
	@ApiProperty({ type: String, default: 'Ai model possibility' })
	description: string
	@ApiProperty({ type: Number, default: 5 })
	stars: number
	@ApiProperty({ type: Number, default: 10 })
	usageTokens: number
	@ApiProperty({ type: String, default: 'Free/Pro' })
	paidTier: string
	@ApiProperty({ type: Float32Array, default: 0.5 })
	temperature: Float32Array
}
