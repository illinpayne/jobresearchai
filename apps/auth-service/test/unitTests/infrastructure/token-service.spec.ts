/* eslint-disable @typescript-eslint/unbound-method */
import { Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtService, TokenExpiredError } from '@nestjs/jwt'
import { Test, TestingModule } from '@nestjs/testing'

import { TokenService } from '@/infrastructure/token-service/token-service.service'

describe('Token service package', () => {
	let service: TokenService
	let jwtService: JwtService
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	let configService: ConfigService

	const mockClaims = {
		id: 'user-123',
		email: 'test@example.com',
		roles: ['admin']
	}

	const mockJwtTokens = {
		accessToken: 'mock-access-token',
		refreshToken: 'mock-refresh-token'
	}

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				TokenService,
				{
					provide: JwtService,
					useValue: {
						sign: jest.fn(),
						verify: jest.fn(),
						decode: jest.fn()
					}
				},
				{
					provide: ConfigService,
					useValue: {
						get: jest.fn((key: string) => {
							if (key === 'jwt.accessTokenTTL') return '15m'
							if (key === 'jwt.refreshTokenTTL') return '7d'
							return null
						})
					}
				}
			]
		}).compile()

		service = module.get<TokenService>(TokenService)
		jwtService = module.get<JwtService>(JwtService)
		configService = module.get<ConfigService>(ConfigService)
	})

	it('Should generate access and refresh tokens with correct payloads', () => {
		jest.spyOn(jwtService, 'sign')
			.mockReturnValueOnce(mockJwtTokens.accessToken)
			.mockReturnValueOnce(mockJwtTokens.refreshToken)

		const result = service.generateTokens(mockClaims)

		expect(jwtService.sign).toHaveBeenNthCalledWith(
			1,
			{
				id: mockClaims.id,
				email: mockClaims.email,
				roles: mockClaims.roles
			},
			{ expiresIn: '15m' }
		)

		expect(jwtService.sign).toHaveBeenNthCalledWith(
			2,
			{ sub: mockClaims.id },
			{ expiresIn: '7d' }
		)

		expect(result).toEqual(mockJwtTokens)
	})

	it('Should return true for a valid token', () => {
		jest.spyOn(jwtService, 'verify').mockReturnValue({ sub: '123' })

		const result = service.verifyToken('valid-token')

		expect(result).toBe(true)
		expect(jwtService.verify).toHaveBeenCalledWith('valid-token')
	})

	it('Should return false and log error when token is expired', () => {
		const loggerSpy = jest
			.spyOn(Logger.prototype, 'error')
			.mockImplementation()
		jest.spyOn(jwtService, 'verify').mockImplementation(() => {
			throw new TokenExpiredError('jwt expired', new Date())
		})

		const result = service.verifyToken('expired-token')

		expect(result).toBe(false)
		expect(loggerSpy).toHaveBeenCalledWith(
			expect.stringContaining('Expired token')
		)
		loggerSpy.mockRestore()
	})

	it('Should return false for invalid tokens (generic error)', () => {
		jest.spyOn(jwtService, 'verify').mockImplementation(() => {
			throw new Error('invalid signature')
		})

		const result = service.verifyToken('invalid-token')

		expect(result).toBe(false)
	})

	it('Should call jwtService.decode', () => {
		const mockDecoded = { sub: '123', email: 'test@test.com' }
		jest.spyOn(jwtService, 'decode').mockReturnValue(mockDecoded)

		const result = service.decodeToken('any-token')

		expect(result).toEqual(mockDecoded)
		expect(jwtService.decode).toHaveBeenCalledWith('any-token')
	})
})
