import { applyDecorators, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Roles, AccountRole } from './roles.decorator'
import { RolesGuard } from '../guards'

export const Protected = (...roles: AccountRole[]) => {
  if (roles.length === 0) return applyDecorators(UseGuards(AuthGuard('jwt')));
  return applyDecorators(
    Roles(...roles),
    UseGuards(AuthGuard('jwt'), RolesGuard),
  );
};
