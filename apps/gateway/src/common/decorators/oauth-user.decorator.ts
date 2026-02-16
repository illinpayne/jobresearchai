import { createParamDecorator, ExecutionContext } from '@nestjs/common'

import { GoogleAccount } from '@/modules/auth/models/google-user.model'

export const OAuthUser = createParamDecorator(
	(data: keyof GoogleAccount, ctx: ExecutionContext) => {
		const request = ctx.switchToHttp().getRequest()
		const user = request.user
		return data ? user![data] : user
	}
)
