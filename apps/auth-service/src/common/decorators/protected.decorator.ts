import { applyDecorators, UseGuards } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { AccountRole } from '@prisma/generated/enums'

import { RolesGuard } from '../guards'

import { Roles } from './roles.decorator'

export const Protected = (...roles: AccountRole[]) => {
	if (roles.length === 0) return applyDecorators(UseGuards(AuthGuard('jwt')))
	return applyDecorators(
		Roles(...roles),
		UseGuards(AuthGuard('jwt'), RolesGuard)
	)
}
