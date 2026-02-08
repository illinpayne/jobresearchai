import { RpcException } from '@nestjs/microservices'
import { Test, TestingModule } from '@nestjs/testing'
import { createHash } from 'crypto'

import { RedisService } from '@/infrastructure/redis/redis.service'
import { OtpService } from '@/modules/otp/otp.service'
import { OTPGeneratedCode } from '@/shared/otp.types'

jest.mock('patcode', () => ({
	generateCode: jest.fn(() => '123456')
}))
const mockRedis = {
	get: jest.fn(),
	del: jest.fn(),
	set: jest.fn()
}

describe('Otp Module', () => {
	let service: OtpService
	let redisService: RedisService

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				OtpService,
				{
					provide: RedisService,
					useValue: mockRedis
				}
			]
		}).compile()

		service = module.get<OtpService>(OtpService)
		redisService = module.get<RedisService>(RedisService)
	})

	afterEach(() => {
		jest.restoreAllMocks()
	})

	it('Should send otp code', async () => {
		jest.spyOn(redisService, 'set').mockResolvedValue('OK')
		jest.spyOn(service as any, 'generateCode').mockReturnValue({
			code: '123456',
			hash: 'somehash'
		} as OTPGeneratedCode)

		const result: OTPGeneratedCode = await service.send(
			'mock@gmail.com',
			'register'
		)

		expect(result.code).toBe('123456')
		expect(result.hash).toBe('somehash')
	})

	it('Should resend otp code', async () => {
		jest.spyOn(redisService, 'set').mockResolvedValue('OK')
		jest.spyOn(service as any, 'generateCode').mockReturnValue({
			code: '123456',
			hash: 'somehash'
		} as OTPGeneratedCode)

		const result: OTPGeneratedCode = await service.resend(
			'mock@gmail.com',
			'register'
		)

		expect(result.code).toBe('123456')
		expect(result.hash).toBe('somehash')
	})

	it('Should throw error when code not expired while resending otp code', async () => {
		jest.spyOn(redisService, 'get').mockResolvedValue('stored code')
		jest.spyOn(service as any, 'generateCode').mockReturnValue({
			code: '123456',
			hash: 'somehash'
		} as OTPGeneratedCode)

		try {
			await service.resend('mock@gmail.com', 'register')
		} catch (error) {
			expect(error).toBeInstanceOf(RpcException)
			expect(error.error.details).toBe('Resend not allowed yet')
			expect(error.error.code).toBe(10)
		}
	})

	it('Should verify otp code', async () => {
		const hash = createHash('sha256').update(String(123456)).digest('hex')

		jest.spyOn(redisService, 'get').mockResolvedValue(hash)
		jest.spyOn(service as any, 'generateCode').mockReturnValue({
			code: '123456',
			hash: 'somehash'
		} as OTPGeneratedCode)

		const result = await service.verify(
			'mock@gmail.com',
			'register',
			'123456'
		)
		expect(result).toBe(true)
		expect(redisService.del).toHaveBeenCalled()
	})

	it('Should throw error when otp code is not valid while verifying', async () => {
		const hash = createHash('sha256').update(String(555666)).digest('hex')

		jest.spyOn(redisService, 'get').mockResolvedValue(hash)
		jest.spyOn(service as any, 'generateCode').mockReturnValue({
			code: '123456',
			hash: 'somehash'
		} as OTPGeneratedCode)

		try {
			await service.verify('mock@gmail.com', 'register', '123456')
		} catch (error) {
			expect(error).toBeInstanceOf(RpcException)
			expect(error.error.details).toBe('Invalid or expired code')
			expect(error.error.code).toBe(10)
		}
	})
})
