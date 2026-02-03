import { Injectable } from '@nestjs/common';
import { AccountRepository } from '../account/account.repository'
import { OtpService } from '../otp/otp.service'
import type { RegisterSendOtpRequest, RegisterSendOtpResponse, RegisterVerifyOtpRequest, AuthResponse, LoginRequest, Account as GrpcAccount } from '@jrai/contracts/gen/auth'
import { RpcException } from '@nestjs/microservices'
import { hash, verify } from 'argon2';
import { Account } from '@prisma/generated/client'
import { TokenService } from '@/infrastructure/token-service/token-service.service'
import { GrpcException, RpcStatus } from '@jrai/contracts/grpc'

@Injectable()
export class AuthService {
	public constructor(private readonly accountRepository: AccountRepository, 
	private readonly otpService: OtpService,
	private readonly tokenService: TokenService) {}

	public async sendOTPRegister(request: RegisterSendOtpRequest) : Promise<RegisterSendOtpResponse> {
		const {email, password, firstName, secondName} = request;
		const findAccount = await this.accountRepository.getByEmail(email);
		if (findAccount) {
			throw new GrpcException(RpcStatus.ALREADY_EXISTS, 'Account already exists');
		}

		const passwordHash = await hash(password);

		try {
			await this.accountRepository.createAccount({email, passwordHash, firstName, secondName});
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		} catch (error) {
			throw new GrpcException(RpcStatus.ABORTED, 'Cannot create account');
		}

		const codes = await this.otpService.send(email, 'register')
		console.log(codes.code)
		//TODO: make send code via notification microservice

		return {
			status: true,
			message: `OTP code was sent on the ${email}`
		}
	}

	public async verifyRegisterAccount(request: RegisterVerifyOtpRequest) : Promise<AuthResponse> {
		const {email, code} = request;

		const isCodeValid = await this.otpService.verify(email, 'register', code);
		if (!isCodeValid) {
			throw new GrpcException(RpcStatus.ABORTED, 'Code is not valid');
		}

		const findAccount = await this.accountRepository.getByEmail(email);
		if (!findAccount) {
			throw new GrpcException(RpcStatus.NOT_FOUND, 'Account not found');
		}

		const verifiedAccount = await this.accountRepository.updateAccount({email}, {isAuthVerified: true, isEmailVerified: true});

		const getTokens = this.generateJwt(verifiedAccount);
		return getTokens;
	}

	public async login(request: LoginRequest) : Promise<AuthResponse> {
		const {email, password} = request;

		const findAccount = await this.accountRepository.getByEmail(email);
		if (!findAccount) {
			throw new GrpcException(RpcStatus.NOT_FOUND, 'Account not found');
		}
		if (!findAccount.isAuthVerified) {
			throw new GrpcException(RpcStatus.ABORTED, 'Account is not completely registered');
		}

		const isPasswordValid = await verify(findAccount.passwordHash, password);
		if (!isPasswordValid) {
			throw new GrpcException(RpcStatus.ABORTED, 'Password is not valid');
		}

		const getTokens = this.generateJwt(findAccount);
		return getTokens;
	}

	private generateJwt(account: Account) : AuthResponse {
		const tokens = this.tokenService.generateTokens({email: account.email, id: account.id});

		return {
			...tokens,
			account: account as GrpcAccount
		}
	}
}
