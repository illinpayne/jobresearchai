export interface JwtPayload {
  	id: string
  	email: string;
	roles: string[];
}

export interface JwtRefreshTokenPayload {
	sub: string
}

export interface JwtTokens {
	accessToken: string;
	refreshToken: string;
}