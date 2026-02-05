import { SetMetadata } from '@nestjs/common'

export enum AccountRole {
	CUSTOMER,
	ADMIN
}

export const ROLES_KEY = 'account_roles'
export const Roles = (...roles: AccountRole[]) => SetMetadata(ROLES_KEY, roles)
