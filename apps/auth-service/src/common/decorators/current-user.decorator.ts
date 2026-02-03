
import { JwtPayload } from '@/shared/jwt.types'
import { createParamDecorator, ExecutionContext } from '@nestjs/common'

export const CurrentUser = createParamDecorator (
	(data: keyof JwtPayload, ctx: ExecutionContext) => {
		const request = ctx.switchToHttp().getRequest()
		const user = request.user
		return data ? user![data] : user
	}
)