import { ConfigService } from '@nestjs/config'
import { JwtModule, JwtService } from '@nestjs/jwt'
import { Test, TestingModule } from '@nestjs/testing'
import type { Account } from '@prisma/generated/client'
import * as argon2 from 'argon2'

import { PrismaService } from '@/infrastructure/prisma/prisma.service'
import { RedisService } from '@/infrastructure/redis/redis.service'
import { TokenService } from '@/infrastructure/token-service/token-service.service'
import { AccountRepository } from '@/modules/account/account.repository'
import { AuthService } from '@/modules/auth/auth.service'
import { OtpService } from '@/modules/otp/otp.service'

import {
	expectAborted,
	expectAlreadyExist,
	expectFailedPrecondition,
	expectInvalidArgument,
	expectNotFound,
	expectUnauthenticated
} from '../../../shared'

jest.mock('argon2', () => ({
	verify: jest.fn(),
	hash: jest.fn()
}))
jest.mock('@/infrastructure/prisma/prisma.service', () => {
	return {
		PrismaService: jest.fn().mockImplementation(() => mockPrisma)
	}
})
const mockPrisma = {
	account: {
		findUnique: jest.fn(),
		create: jest.fn(),
		updateAccount: jest.fn()
	}
}
const mockRedis = {
	get: jest.fn(),
	del: jest.fn(),
	set: jest.fn()
}

describe('Auth Module', () => {
	let service: AuthService
	let otpService: OtpService
	let accountRepository: AccountRepository
	let tokenService: TokenService

	let account: Account = {
		id: 'userId',
		email: 'mock@gmail.com',
		passwordHash: 'hashpassword',
		firstName: 'Vito',
		secondName: 'Cornleone',
		avatar: 'https://jrai.s3.amazonaws.com/avatars/default.png',
		isAuthVerified: true,
		role: 'CUSTOMER',
		isEmailVerified: true,
		createdAt: new Date('2026-01-01T00:00:00.000Z'),
		updatedAt: new Date('2026-01-01T00:00:00.000Z')
	}

	beforeEach(async () => {
		jest.spyOn(console, 'log').mockImplementation(() => {})

		const module: TestingModule = await Test.createTestingModule({
			imports: [
				JwtModule.register({
					secret: 'test-secret',
					signOptions: { expiresIn: '60s' }
				})
			],
			providers: [
				ConfigService,
				AuthService,
				TokenService,
				AccountRepository,
				OtpService,
				JwtService,
				{
					provide: PrismaService,
					useValue: mockPrisma
				},
				{
					provide: RedisService,
					useValue: mockRedis
				}
			]
		}).compile()

		service = module.get<AuthService>(AuthService)
		otpService = module.get<OtpService>(OtpService)
		accountRepository = module.get<AccountRepository>(AccountRepository)
		tokenService = module.get<TokenService>(TokenService)
	})

	afterEach(() => {
		jest.restoreAllMocks()
	})

	it('Should send otp code for register', async () => {
		mockPrisma.account.findUnique.mockResolvedValue(null)
		;(argon2.hash as jest.Mock).mockResolvedValue(account.passwordHash)
		jest.spyOn(accountRepository, 'createAccount').mockResolvedValue(
			account
		)
		jest.spyOn(otpService, 'send').mockResolvedValue({
			hash: 'somehash',
			code: '1234'
		})

		const response = await service.sendOTPRegister({
			email: account.email,
			firstName: account.firstName,
			secondName: account.secondName,
			password: 'plaintextpassword'
		})

		expect(response).toEqual({
			status: true,
			message: `OTP code was sent on the ${account.email}`
		})
	})

	it('Should throw already exist error when sending register otp', async () => {
		mockPrisma.account.findUnique.mockResolvedValue(account)

		try {
			await service.sendOTPRegister({
				email: account.email,
				firstName: account.firstName,
				secondName: account.secondName,
				password: 'plaintextpassword'
			})
		} catch (error) {
			expectAlreadyExist(error, 'Account already exists')
		}
	})

	it('Should throw abort error when sending register otp', async () => {
		mockPrisma.account.findUnique.mockResolvedValue(null)
		mockPrisma.account.create.mockRejectedValue(null)

		try {
			await service.sendOTPRegister({
				email: account.email,
				firstName: account.firstName,
				secondName: account.secondName,
				password: 'plaintextpassword'
			})
		} catch (error) {
			expectAborted(error, 'Cannot create account')
		}
	})

	it('Should resend otp register', async () => {
		const modifiedAccount = { ...account, isAuthVerified: false }
		mockPrisma.account.findUnique.mockResolvedValue(modifiedAccount)
		;(argon2.hash as jest.Mock).mockResolvedValue(account.passwordHash)

		jest.spyOn(otpService, 'send').mockResolvedValue({
			hash: 'somehash',
			code: '1234'
		})
		const response = await service.resendOTPRegister({
			email: account.email
		})
		expect(response).toEqual({
			status: true,
			message: `OTP code was sent on the ${account.email}`
		})
	})

	it('Should throw not found while resending otp register', async () => {
		mockPrisma.account.findUnique.mockResolvedValue(null)

		try {
			await service.resendOTPRegister({
				email: account.email
			})
		} catch (error) {
			expectNotFound(error, 'Account not found')
		}
	})

	it('Should throw already exist while resending otp register', async () => {
		mockPrisma.account.findUnique.mockResolvedValue(account)

		try {
			await service.resendOTPRegister({
				email: account.email
			})
		} catch (error) {
			expectAlreadyExist(error, 'Account already created')
		}
	})

	it('Should verify registration', async () => {
		mockPrisma.account.findUnique.mockResolvedValue(account)
		jest.spyOn(otpService, 'verify').mockResolvedValue(true)
		jest.spyOn(accountRepository, 'updateAccount').mockResolvedValue({
			...account
		})
		jest.spyOn(tokenService, 'generateTokens').mockReturnValue({
			accessToken: 'accesstoken',
			refreshToken: 'refreshtoken'
		})

		const response = await service.verifyRegisterAccount({
			email: account.email,
			code: '123456'
		})
		expect(response.accessToken).toBe('accesstoken')
		expect(response.account?.email).toBe(account.email)
		expect(response.account?.firstName).toBe(account.firstName)
		expect(response.account?.secondName).toBe(account.secondName)
		expect(response.account?.avatar).toBe(account.avatar)
		expect(response.account?.isEmailVerified).toBe(account.isEmailVerified)
	})

	it('Should throw not valid code while verifying registration', async () => {
		mockPrisma.account.findUnique.mockResolvedValue(account)
		jest.spyOn(otpService, 'verify').mockResolvedValue(false)

		try {
			await service.verifyRegisterAccount({
				email: account.email,
				code: '123456'
			})
		} catch (error) {
			expectInvalidArgument(error, 'Code is not valid')
		}
	})

	it('Should throw not found account while verifying registration', async () => {
		mockPrisma.account.findUnique.mockResolvedValue(null)
		jest.spyOn(otpService, 'verify').mockResolvedValue(true)
		try {
			await service.verifyRegisterAccount({
				email: account.email,
				code: '123456'
			})
		} catch (error) {
			expectNotFound(error, 'Account not found')
		}
	})

	it('Should throw cannot verify account while verifying registration', async () => {
		mockPrisma.account.findUnique.mockResolvedValue(account)
		jest.spyOn(otpService, 'verify').mockResolvedValue(true)
		mockPrisma.account.updateAccount.mockRejectedValue(
			new Error('Update error')
		)
		try {
			await service.verifyRegisterAccount({
				email: account.email,
				code: '123456'
			})
		} catch (error) {
			expectAborted(error, 'Cannot verify account')
		}
	})

	it('Should login', async () => {
		mockPrisma.account.findUnique.mockResolvedValue(account)
		mockPrisma.account.updateAccount.mockRejectedValue(
			new Error('Update error')
		)
		;(argon2.verify as jest.Mock).mockResolvedValue(true)
		jest.spyOn(tokenService, 'generateTokens').mockReturnValue({
			accessToken: 'accesstoken',
			refreshToken: 'refreshtoken'
		})

		const response = await service.login({
			email: account.email,
			password: 'plaintextpassword'
		})
		expect(response.accessToken).toBe('accesstoken')
		expect(response.account?.email).toBe(account.email)
		expect(response.account?.firstName).toBe(account.firstName)
		expect(response.account?.secondName).toBe(account.secondName)
		expect(response.account?.avatar).toBe(account.avatar)
		expect(response.account?.isEmailVerified).toBe(account.isEmailVerified)
	})

	it('Should throw not found account while login', async () => {
		mockPrisma.account.findUnique.mockResolvedValue(null)

		try {
			await service.login({
				email: account.email,
				password: 'plaintextpassword'
			})
		} catch (error) {
			expectNotFound(error, 'Account not found')
		}
	})

	it('Should throw not complete registration while login', async () => {
		const modifiedAccount = { ...account, isAuthVerified: false }
		mockPrisma.account.findUnique.mockResolvedValue(modifiedAccount)

		try {
			await service.login({
				email: account.email,
				password: 'plaintextpassword'
			})
		} catch (error) {
			expectAborted(error, 'Account is not completely registered')
		}
	})

	it('Should throw passwoord not valid while login', async () => {
		mockPrisma.account.findUnique.mockResolvedValue(account)
		;(argon2.verify as jest.Mock).mockResolvedValue(false)

		try {
			await service.login({
				email: account.email,
				password: 'plaintextpassword'
			})
		} catch (error) {
			expectAborted(error, 'Password is not valid')
		}
	})

	it('Should login with google oauth', async () => {
		mockPrisma.account.findUnique.mockResolvedValue(account)
		jest.spyOn(tokenService, 'generateTokens').mockReturnValue({
			accessToken: 'accesstoken',
			refreshToken: 'refreshtoken'
		})

		const response = await service.oAuthSignin({
			email: account.email,
			givenName: account.firstName,
			familyName: account.secondName,
			picture: account.avatar as string,
			provider: 'google'
		})
		expect(response.accessToken).toBe('accesstoken')
		expect(response.account?.email).toBe(account.email)
		expect(response.account?.firstName).toBe(account.firstName)
		expect(response.account?.secondName).toBe(account.secondName)
		expect(response.account?.avatar).toBe(account.avatar)
		expect(response.account?.isEmailVerified).toBe(account.isEmailVerified)
	})

	it('Should abort if account isnt verified while login with google oauth', async () => {
		const modifiedAccount = { ...account, isAuthVerified: false }
		mockPrisma.account.findUnique.mockResolvedValue(modifiedAccount)
		jest.spyOn(tokenService, 'generateTokens').mockReturnValue({
			accessToken: 'accesstoken',
			refreshToken: 'refreshtoken'
		})

		try {
			await service.oAuthSignin({
				email: account.email,
				givenName: account.firstName,
				familyName: account.secondName,
				picture: account.avatar as string,
				provider: 'google'
			})
		} catch (error) {
			expectAborted(error, 'Account is not completely registered')
		}
	})

	it('Should register with google oauth', async () => {
		mockPrisma.account.findUnique.mockResolvedValue(null)
		mockPrisma.account.create.mockResolvedValue(account)

		jest.spyOn(tokenService, 'generateTokens').mockReturnValue({
			accessToken: 'accesstoken',
			refreshToken: 'refreshtoken'
		})

		const response = await service.oAuthSignin({
			email: account.email,
			givenName: account.firstName,
			familyName: account.secondName,
			picture: account.avatar as string,
			provider: 'google'
		})
		expect(response.accessToken).toBe('accesstoken')
		expect(response.account?.email).toBe(account.email)
		expect(response.account?.firstName).toBe(account.firstName)
		expect(response.account?.secondName).toBe(account.secondName)
		expect(response.account?.avatar).toBe(account.avatar)
		expect(response.account?.isEmailVerified).toBe(account.isEmailVerified)
	})

	it('Should abort if regiter error while register with google oauth', async () => {
		mockPrisma.account.findUnique.mockResolvedValue(null)
		mockPrisma.account.create.mockResolvedValue(account)

		jest.spyOn(tokenService, 'generateTokens').mockReturnValue({
			accessToken: 'accesstoken',
			refreshToken: 'refreshtoken'
		})

		try {
			await service.oAuthSignin({
				email: account.email,
				givenName: account.firstName,
				familyName: account.secondName,
				picture: account.avatar as string,
				provider: 'google'
			})
		} catch (error) {
			expectAborted(error, 'Cannot register account')
		}
	})

	it('Should revalidate session', async () => {
		jest.spyOn(tokenService, 'verifyToken').mockReturnValue(true)
		jest.spyOn(tokenService, 'decodeToken').mockReturnValue({
			sub: account.id
		})
		mockPrisma.account.findUnique.mockResolvedValue(account)
		jest.spyOn(tokenService, 'generateAccessToken').mockReturnValue(
			'accesstoken'
		)

		const response = await service.revalidateSession({
			refreshToken: 'sometoken'
		})
		expect(response.accessToken).toBe('accesstoken')
		expect(response.account?.email).toBe(account.email)
		expect(response.account?.firstName).toBe(account.firstName)
		expect(response.account?.secondName).toBe(account.secondName)
		expect(response.account?.avatar).toBe(account.avatar)
		expect(response.account?.isEmailVerified).toBe(account.isEmailVerified)
	})

	it('Should throw not valid token while revalidate session', async () => {
		jest.spyOn(tokenService, 'verifyToken').mockReturnValue(false)

		try {
			await service.revalidateSession({
				refreshToken: 'sometoken'
			})
		} catch (error) {
			expectUnauthenticated(error, 'Session expired. Please login again')
		}
	})

	it('Should throw not found exception while revalidate session', async () => {
		jest.spyOn(tokenService, 'verifyToken').mockReturnValue(true)
		jest.spyOn(tokenService, 'decodeToken').mockReturnValue({
			sub: account.id
		})
		mockPrisma.account.findUnique.mockResolvedValue(null)

		try {
			await service.revalidateSession({
				refreshToken: 'sometoken'
			})
		} catch (error) {
			expectNotFound(error, 'Account not found')
		}
	})

	it('Should send otp for forgot password', async () => {
		mockPrisma.account.findUnique.mockResolvedValue(account)
		jest.spyOn(otpService, 'send').mockResolvedValue({
			hash: 'somehash',
			code: '1234'
		})

		const response = await service.forgotPassword({
			email: account.email
		})
		expect(response).toEqual({
			status: true,
			message: `OTP code was sent on the ${account.email}`
		})
	})

	it('Should throw not found while sending otp for forgot password', async () => {
		mockPrisma.account.findUnique.mockResolvedValue(null)

		try {
			await service.forgotPassword({
				email: account.email
			})
		} catch (error) {
			expectNotFound(error, 'Account not found')
		}
	})

	it('Should reset password', async () => {
		mockPrisma.account.findUnique.mockResolvedValue(account)
		jest.spyOn(otpService, 'verify').mockResolvedValue(true)
		;(argon2.hash as jest.Mock).mockResolvedValue('newhashpassword')
		jest.spyOn(accountRepository, 'updateAccount').mockResolvedValue({
			...account,
			passwordHash: 'newhashpassword'
		})

		const response = await service.resetPassword({
			email: account.email,
			code: '123456',
			newPassword: 'newplaintextpassword'
		})
		expect(response).toEqual({
			status: true,
			message: `Password was successfully reset`
		})
	})

	it('Should throw not valid code while resetting password', async () => {
		mockPrisma.account.findUnique.mockResolvedValue(account)
		jest.spyOn(otpService, 'verify').mockResolvedValue(false)

		try {
			await service.resetPassword({
				email: account.email,
				code: '123456',
				newPassword: 'newplaintextpassword'
			})
		} catch (error) {
			expectInvalidArgument(error, 'Code is not valid')
		}
	})

	it('Should throw not found account while resetting password', async () => {
		mockPrisma.account.findUnique.mockResolvedValue(null)
		jest.spyOn(otpService, 'verify').mockResolvedValue(true)

		try {
			await service.resetPassword({
				email: account.email,
				code: '123456',
				newPassword: 'newplaintextpassword'
			})
		} catch (error) {
			expectNotFound(error, 'Account not found')
		}
	})

	it('Should throw cannot reset password while resetting password', async () => {
		mockPrisma.account.findUnique.mockResolvedValue(account)
		jest.spyOn(otpService, 'verify').mockResolvedValue(true)
		;(argon2.hash as jest.Mock).mockResolvedValue('newhashpassword')
		jest.spyOn(accountRepository, 'updateAccount').mockRejectedValue(
			new Error('Update error')
		)

		try {
			await service.resetPassword({
				email: account.email,
				code: '123456',
				newPassword: 'newplaintextpassword'
			})
		} catch (error) {
			expectAborted(error, 'Cannot reset password')
		}
	})

	it('Should login with oauth', async () => {
		mockPrisma.account.findUnique.mockResolvedValue(account)
		jest.spyOn(tokenService, 'generateTokens').mockReturnValue({
			accessToken: 'accesstoken',
			refreshToken: 'refreshtoken'
		})

		const response = await service.oAuthSignin({
			email: account.email,
			givenName: account.firstName,
			familyName: account.secondName,
			picture: account.avatar as string,
			provider: 'google'
		})
		expect(response.accessToken).toBe('accesstoken')
		expect(response.account?.email).toBe(account.email)
		expect(response.account?.firstName).toBe(account.firstName)
		expect(response.account?.secondName).toBe(account.secondName)
		expect(response.account?.avatar).toBe(account.avatar)
		expect(response.account?.isEmailVerified).toBe(account.isEmailVerified)
	})

	it('Should throw aborted if account not completely created while login with oauth', async () => {
		const modified = { ...account, isAuthVerified: false }
		mockPrisma.account.findUnique.mockResolvedValue(modified)
		jest.spyOn(tokenService, 'generateTokens').mockReturnValue({
			accessToken: 'accesstoken',
			refreshToken: 'refreshtoken'
		})

		try {
			await service.oAuthSignin({
				email: account.email,
				givenName: account.firstName,
				familyName: account.secondName,
				picture: account.avatar as string,
				provider: 'google'
			})
		} catch (error) {
			expectAborted(error, 'Account is not completely registered')
		}
	})

	it('Should register with oauth', async () => {
		mockPrisma.account.findUnique.mockResolvedValue(null)
		const modified = {
			...account,
			isAuthVerified: true,
			isEmailVerified: true
		}
		jest.spyOn(accountRepository, 'createAccount').mockResolvedValue(
			modified
		)
		jest.spyOn(tokenService, 'generateTokens').mockReturnValue({
			accessToken: 'accesstoken',
			refreshToken: 'refreshtoken'
		})

		const response = await service.oAuthSignin({
			email: account.email,
			givenName: account.firstName,
			familyName: account.secondName,
			picture: account.avatar as string,
			provider: 'google'
		})
		expect(response.accessToken).toBe('accesstoken')
		expect(response.account?.email).toBe(account.email)
		expect(response.account?.firstName).toBe(account.firstName)
		expect(response.account?.secondName).toBe(account.secondName)
		expect(response.account?.avatar).toBe(account.avatar)
	})

	it('Should throw aborted while register with oauth', async () => {
		mockPrisma.account.findUnique.mockResolvedValue(null)
		jest.spyOn(accountRepository, 'createAccount').mockRejectedValue(null)

		try {
			await service.oAuthSignin({
				email: account.email,
				givenName: account.firstName,
				familyName: account.secondName,
				picture: account.avatar as string,
				provider: 'google'
			})
		} catch (error) {
			expectAborted(error, 'Cannot verify account')
		}
	})

	it('Should send otp for change email', async () => {
		mockPrisma.account.findUnique.mockResolvedValue(account)
		jest.spyOn(otpService, 'resend').mockResolvedValue({
			hash: 'somehash',
			code: '1234'
		})

		const response = await service.sendEmailOTP({
			email: account.email
		})
		expect(response).toEqual({
			status: true,
			message: `OTP code was sent on the ${account.email}`
		})
	})

	it('Should throw not found error while send otp for change email', async () => {
		mockPrisma.account.findUnique.mockResolvedValue(null)

		try {
			await service.sendEmailOTP({
				email: account.email
			})
		} catch (error) {
			expectNotFound(error, 'Account not found')
		}
	})

	it('Should change email with otp verification', async () => {
		mockPrisma.account.findUnique.mockResolvedValueOnce(account)
		mockPrisma.account.findUnique.mockResolvedValueOnce(null)
		jest.spyOn(otpService, 'verify').mockResolvedValue(true)
		jest.spyOn(accountRepository, 'updateAccount').mockResolvedValue({
			...account,
			passwordHash: 'newhashpassword'
		})

		const response = await service.changeEmail({
			email: account.email,
			newEmail: 'newemail@gmail.com',
			code: '123456'
		})
		expect(response.message).toBe('Email was successfully changed')
		expect(response.status).toBe(true)
	})

	it('Should throw not found authorized user while change email with otp verification', async () => {
		mockPrisma.account.findUnique.mockResolvedValueOnce(null)
		try {
			await service.changeEmail({
				email: account.email,
				newEmail: 'newemail@gmail.com',
				code: '123456'
			})
		} catch (error) {
			expectNotFound(error, 'Account not found')
		}
	})

	it('Should throw not added password before change email while change email with otp verification', async () => {
		const modified = { ...account, passwordHash: '' }
		mockPrisma.account.findUnique.mockResolvedValueOnce(modified)
		jest.spyOn(otpService, 'verify').mockResolvedValue(true)
		jest.spyOn(accountRepository, 'updateAccount').mockResolvedValue({
			...account,
			passwordHash: 'newhashpassword'
		})

		try {
			await service.changeEmail({
				email: account.email,
				newEmail: 'newemail@gmail.com',
				code: '123456'
			})
		} catch (error) {
			expectFailedPrecondition(
				error,
				'There is no password for this account, please add password first'
			)
		}
	})

	it('Should throw found account by new email while change email with otp verification', async () => {
		mockPrisma.account.findUnique.mockResolvedValueOnce(account)
		mockPrisma.account.findUnique.mockResolvedValueOnce(account)
		try {
			await service.changeEmail({
				email: account.email,
				newEmail: 'newemail@gmail.com',
				code: '123456'
			})
		} catch (error) {
			expectAborted(error, 'Account already exists')
		}
	})

	it('Should throw not valid code while change email with otp verification', async () => {
		mockPrisma.account.findUnique.mockResolvedValueOnce(account)
		mockPrisma.account.findUnique.mockResolvedValueOnce(null)
		jest.spyOn(otpService, 'verify').mockResolvedValue(false)

		try {
			await service.changeEmail({
				email: account.email,
				newEmail: 'newemail@gmail.com',
				code: '123456'
			})
		} catch (error) {
			expectInvalidArgument(error, 'Code is not valid')
		}
	})

	it('Should throw aborted while unable to update accont while change email with otp verification', async () => {
		mockPrisma.account.findUnique.mockResolvedValueOnce(account)
		mockPrisma.account.findUnique.mockResolvedValueOnce(null)
		jest.spyOn(otpService, 'verify').mockResolvedValue(true)
		jest.spyOn(accountRepository, 'updateAccount').mockRejectedValue(null)

		try {
			await service.changeEmail({
				email: account.email,
				newEmail: 'newemail@gmail.com',
				code: '123456'
			})
		} catch (error) {
			expectAborted(error, 'Cannot change email')
		}
	})
})
