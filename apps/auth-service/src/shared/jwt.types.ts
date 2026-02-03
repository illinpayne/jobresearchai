export interface JwtPayload {
  	id: string
  	email: string;
}

export interface JwtTokens {
	accessToken: string;
	refreshToken: string;
}