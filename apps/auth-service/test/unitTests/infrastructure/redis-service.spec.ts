/* eslint-disable @typescript-eslint/unbound-method */
import { ConfigService } from '@nestjs/config'
import { Test, TestingModule } from '@nestjs/testing'

import { RedisService } from '@/infrastructure/redis/redis.service'

jest.mock('ioredis', () => {
	return jest.fn().mockImplementation(() => {
		return {
			on: jest.fn(),
			quit: jest.fn().mockResolvedValue('OK'),
			// We must mock 'then' as undefined so it doesn't look like a Promise
			then: undefined
		}
	})
})

describe('Redis service package', () => {
	let service: RedisService
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	let configService: ConfigService

	const mockConfig = {
		'redis.user': 'default',
		'redis.password': 'secret',
		'redis.host': 'localhost',
		'redis.port': 6379
	}

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				RedisService,
				{
					provide: ConfigService,
					useValue: {
						get: jest.fn((key: string) => mockConfig[key])
					}
				}
			]
		}).compile()

		service = module.get<RedisService>(RedisService)
		configService = module.get<ConfigService>(ConfigService)
	})

	it('Should be defined', () => {
		expect(service).toBeDefined()
	})
})
