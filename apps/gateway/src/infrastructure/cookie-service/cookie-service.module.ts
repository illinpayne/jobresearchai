import { Module } from '@nestjs/common'

import { CookieService } from './cookie-service.service'

@Module({
	providers: [CookieService],
	exports: [CookieService]
})
export class CookieModule {}
