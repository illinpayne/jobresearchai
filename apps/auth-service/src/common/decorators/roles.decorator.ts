import { SetMetadata } from '@nestjs/common'
import { AccountRole } from '@prisma/generated/enums'

export const ROLES_KEY = 'account_roles'
export const Roles = (...roles: AccountRole[]) => SetMetadata(ROLES_KEY, roles)
