import {
	type CanActivate,
	type ExecutionContext,
	ForbiddenException,
	Injectable
} from '@nestjs/common'
import { Reflector } from '@nestjs/core'

import { AccountRole, ROLES_KEY } from '../decorators/roles.decorator'

@Injectable()
export class RolesGuard implements CanActivate {
	public constructor(private readonly reflector: Reflector) {}

	public canActivate(context: ExecutionContext): boolean {
		const roles = this.reflector.getAllAndOverride<AccountRole[]>(
			ROLES_KEY,
			[context.getHandler(), context.getClass()]
		)
		const request = context.switchToHttp().getRequest()
		if (!roles) return true

		const hasRole = roles.some(role => request.user.roles?.includes(role))

		if (!hasRole) {
			throw new ForbiddenException(
				'Access denided, you do not have the required role to access this resource.'
			)
		}

		return true
	}
}
