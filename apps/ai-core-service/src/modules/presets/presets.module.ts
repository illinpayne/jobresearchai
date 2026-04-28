import { Module } from '@nestjs/common'

import { PresetRepository } from './preset.repository'
import { PresetsController } from './presets.controller'
import { PresetsService } from './presets.service'

@Module({
	controllers: [PresetsController],
	providers: [PresetsService, PresetRepository]
})
export class PresetsModule {}
