import type {
	AuthResponse,
	Account as GrpcAccount,
	LoginRequest,
	RegisterSendOtpRequest,
	RegisterSendOtpResponse,
	RegisterVerifyOtpRequest,
	RevalidateSessionRequest
} from '@jrai/contracts/gen/auth'
import { GrpcException, RpcStatus } from '@jrai/contracts/grpc'
import { Injectable } from '@nestjs/common'
import { Account } from '@prisma/generated/client'
import { hash, verify } from 'argon2'

import { TokenService } from '@/infrastructure/token-service/token-service.service'

import { AccountRepository } from '../account/account.repository'
import { OtpService } from '../otp/otp.service'

@Injectable()
export class AuthService {
	public constructor(
		private readonly accountRepository: AccountRepository,
		private readonly otpService: OtpService,
		private readonly tokenService: TokenService
	) {}

	public async sendOTPRegister(
		request: RegisterSendOtpRequest
	): Promise<RegisterSendOtpResponse> {
		const { email, password, firstName, secondName } = request
		const findAccount = await this.accountRepository.getByEmail(email)
		if (findAccount) {
			throw new GrpcException(
				RpcStatus.ALREADY_EXISTS,
				'Account already exists'
			)
		}

		const passwordHash = await hash(password)

		try {
			await this.accountRepository.createAccount({
				email,
				passwordHash,
				firstName,
				secondName
			})
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
		} catch (error) {
			throw new GrpcException(RpcStatus.ABORTED, 'Cannot create account')
		}

		const codes = await this.otpService.send(email, 'register')

		//TODO: make send code via notification microservice
		// eslint-disable-next-line no-console
		console.log(codes.code)

		return {
			status: true,
			message: `OTP code was sent on the ${email}`
		}
	}

	public async verifyRegisterAccount(
		request: RegisterVerifyOtpRequest
	): Promise<AuthResponse> {
		const { email, code } = request

		const isCodeValid = await this.otpService.verify(
			email,
			'register',
			code
		)
		if (!isCodeValid) {
			throw new GrpcException(RpcStatus.ABORTED, 'Code is not valid')
		}

		const findAccount = await this.accountRepository.getByEmail(email)
		if (!findAccount) {
			throw new GrpcException(RpcStatus.NOT_FOUND, 'Account not found')
		}

		const verifiedAccount = await this.accountRepository.updateAccount(
			{ email },
			{ isAuthVerified: true, isEmailVerified: true }
		)

		const getTokens = this.generateJwt(verifiedAccount)
		return getTokens
	}

	public async login(request: LoginRequest): Promise<AuthResponse> {
		const { email, password } = request

		const findAccount = await this.accountRepository.getByEmail(email)
		if (!findAccount) {
			throw new GrpcException(RpcStatus.NOT_FOUND, 'Account not found')
		}
		if (!findAccount.isAuthVerified) {
			throw new GrpcException(
				RpcStatus.ABORTED,
				'Account is not completely registered'
			)
		}

		const isPasswordValid = await verify(findAccount.passwordHash, password)
		if (!isPasswordValid) {
			throw new GrpcException(RpcStatus.ABORTED, 'Password is not valid')
		}

		//TODO: refactor return immediately
		const getTokens = this.generateJwt(findAccount)
		return getTokens
	}

	public async revalidateSession(
		request: RevalidateSessionRequest
	): Promise<AuthResponse> {
		const { refreshToken } = request

		const isValid = this.tokenService.verifyToken(refreshToken)
		if (!isValid) {
			throw new GrpcException(
				RpcStatus.UNAUTHENTICATED,
				'Session expired. Please login again'
			)
		}

		const decodedToken = this.tokenService.decodeToken(refreshToken)
		const userId = decodedToken?.sub

		const findAccount = await this.accountRepository.getById(userId)
		if (!findAccount) {
			throw new GrpcException(RpcStatus.NOT_FOUND, 'Account not found')
		}

		return this.generateJwt(findAccount)
	}

	private generateJwt(account: Account): AuthResponse {
		const tokens = this.tokenService.generateTokens({
			email: account.email,
			id: account.id,
			roles: [account.role]
		})

		return {
			...tokens,
			account: account as GrpcAccount
		}
	}
}
