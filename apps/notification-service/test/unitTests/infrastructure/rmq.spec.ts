import { Logger } from '@nestjs/common'
import { RmqContext } from '@nestjs/microservices'
import { Test, TestingModule } from '@nestjs/testing'

import { RmqService } from '@/infrastructure/rmq/rmq.service'

describe('RMQ service package', () => {
	let service: RmqService

	const mockChannel = {
		ack: jest.fn(),
		nack: jest.fn()
	}

	const mockMessage = {
		fields: {
			deliveryTag: 12345
		}
	}

	const mockContext = {
		getChannelRef: jest.fn().mockReturnValue(mockChannel),
		getMessage: jest.fn().mockReturnValue(mockMessage),
		getPattern: jest.fn().mockReturnValue('test_pattern')
	} as unknown as RmqContext

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [RmqService]
		}).compile()

		service = module.get<RmqService>(RmqService)
		jest.clearAllMocks()
	})

	describe('Rmq ack', () => {
		it('Should acknowledge the message if a delivery tag exists', () => {
			service.ack(mockContext)

			expect(mockChannel.ack).toHaveBeenCalledWith(mockMessage)
		})

		it('Should return early if there is no delivery tag', () => {
			const contextNoTag = {
				getChannelRef: jest.fn().mockReturnValue(mockChannel),
				getMessage: jest.fn().mockReturnValue({ fields: {} })
			} as unknown as RmqContext

			service.ack(contextNoTag)

			expect(mockChannel.ack).not.toHaveBeenCalled()
		})
	})

	describe('Rmq Ack', () => {
		it('Should nack and log a warning when requeue is true', () => {
			const loggerSpy = jest
				.spyOn(Logger.prototype, 'warn')
				.mockImplementation()

			service.nack(mockContext, true)

			expect(mockChannel.nack).toHaveBeenCalledWith(
				mockMessage,
				false,
				true
			)
			expect(loggerSpy).toHaveBeenCalledWith(
				expect.stringContaining(
					'Nack with requeue (pattern: test_pattern, tag: 12345)'
				)
			)
		})

		it('Should nack and log an error when requeue is false', () => {
			const loggerSpy = jest
				.spyOn(Logger.prototype, 'error')
				.mockImplementation()

			service.nack(mockContext, false)

			expect(mockChannel.nack).toHaveBeenCalledWith(
				mockMessage,
				false,
				false
			)
			expect(loggerSpy).toHaveBeenCalledWith(
				expect.stringContaining(
					'Nack drop (pattern: test_pattern, tag: 12345)'
				)
			)
		})

		it('Should return early if there is no delivery tag (nack)', () => {
			const contextNoTag = {
				getChannelRef: jest.fn().mockReturnValue(mockChannel),
				getMessage: jest.fn().mockReturnValue(null)
			} as unknown as RmqContext

			service.nack(contextNoTag)

			expect(mockChannel.nack).not.toHaveBeenCalled()
		})
	})
})
