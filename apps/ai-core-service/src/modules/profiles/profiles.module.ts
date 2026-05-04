import { Module } from '@nestjs/common'

import { ProfileRepository } from './profile.repository'
import { ProfilesController } from './profiles.controller'
import { ProfilesService } from './profiles.service'

@Module({
	controllers: [ProfilesController],
	providers: [ProfilesService, ProfileRepository]
})
export class ProfilesModule {}
