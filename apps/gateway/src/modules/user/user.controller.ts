import { Controller, Get } from '@nestjs/common'

import { Protected } from '@/common/decorators'

@Controller('user')
export class UserController {
	constructor() {}

	@Get('me')
	@Protected()
	public getMe() {
		return {
			email: 'bober@gmail.com',
			firstName: 'Tony',
			secondName: 'Soprano',
			isEmailVerified: true
		}
	}
}
