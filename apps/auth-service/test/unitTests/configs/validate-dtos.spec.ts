import {
	IsEnum,
	IsInt,
	IsNotEmpty,
	IsOptional,
	IsString,
	IsUrl,
	Max,
	Min
} from 'class-validator'
import 'reflect-metadata'

import { validateEnv } from '@/config/utils/env'
import { Environment } from '@/config/validators'

class EnvValidator {
	@IsInt()
	@Min(0)
	@Max(65535)
	@IsOptional()
	public GRPC_PORT: number

	@IsString()
	@IsNotEmpty()
	public GRPC_HOST: string

	@IsEnum(Environment)
	public NODE_ENV: string
}

describe('validateEnv', () => {
	const originalEnv = process.env

	beforeEach(() => {
		jest.resetModules()
		process.env = { ...originalEnv }
	})

	afterAll(() => {
		process.env = originalEnv
		jest.restoreAllMocks()
	})

	it('Should return a validated instance when env is valid', () => {
		const env: NodeJS.ProcessEnv = {
			GRPC_PORT: '50051',
			GRPC_HOST: 'localhost',
			NODE_ENV: 'development'
		}

		const validated = validateEnv(env, EnvValidator)
		expect(validated).toBeInstanceOf(EnvValidator)
		// @ts-expect-error: runtime check
		expect(validated.NODE_ENV).toBe('development')
		// @ts-expect-error: runtime check
		expect(validated.GRPC_PORT).toBe(50051)
		// @ts-expect-error: runtime check
		expect(validated.GRPC_HOST).toBe('localhost')
	})

	it('Should throw error when port is greater than expected', () => {
		const env: NodeJS.ProcessEnv = {
			GRPC_PORT: '70051',
			GRPC_HOST: 'localhost',
			NODE_ENV: 'development'
		}

		try {
			validateEnv(env, EnvValidator)
		} catch (error: Error | any) {
			expect(error).toBeInstanceOf(Error)
			expect(error.message).toContain(
				'GRPC_PORT must not be greater than'
			)
		}
	})

	it('Should throw error when the env is not valid', () => {
		const env: NodeJS.ProcessEnv = {
			GRPC_PORT: 'notvalid',
			GRPC_HOST: 'something',
			NODE_ENV: 'mock'
		}

		try {
			validateEnv(env, EnvValidator)
		} catch (error: Error | any) {
			expect(error).toBeInstanceOf(Error)
			expect(error.message).toContain('GRPC_PORT')
			expect(error.message).toContain('NODE_ENV')
		}
	})
})
