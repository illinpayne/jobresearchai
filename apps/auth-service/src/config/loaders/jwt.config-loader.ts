import type { ConfigService } from '@nestjs/config';
import type { JwtModuleOptions } from '@nestjs/jwt';
import type { AllConfigs } from '../interfaces';

export function getJwtConfig(
	config: ConfigService<AllConfigs>,
): JwtModuleOptions {
	return {
		secret: config.get('jwt.jwtSecret', { infer: true }),
		signOptions: {
			algorithm: 'HS256',
		},
		verifyOptions: {
			algorithms: ['HS256'],
			ignoreExpiration: false,
		},
	};
}
