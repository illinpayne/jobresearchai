import { Logger } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'
import { Job } from 'bullmq'

import { ExtendedMailService } from '@/common/abstractions/mail.service.abstract'
import { MailProcessor } from '@/infrastructure/mail/mail.processor'

describe('Rmq Mail Processor', () => {
	let processor: MailProcessor
	let mailService: ExtendedMailService

	const mockMailService = {
		send: jest.fn()
	}

	const mockJob = {
		data: {
			email: 'tony.soprano@gmail.com',
			subject: 'Test message',
			html: '<p>Hi there!</p>'
		}
	} as Job

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				MailProcessor,
				{
					provide: ExtendedMailService,
					useValue: mockMailService
				}
			]
		}).compile()

		processor = module.get<MailProcessor>(MailProcessor)
		mailService = module.get<ExtendedMailService>(ExtendedMailService)

		jest.clearAllMocks()
	})

	it('Should be defined', () => {
		expect(processor).toBeDefined()
	})

	describe('Process queue', () => {
		it('Should successfully call send with job data', async () => {
			mockMailService.send.mockResolvedValue(undefined)

			await processor.process(mockJob)

			expect(mailService.send).toHaveBeenCalledWith(
				mockJob.data.email,
				mockJob.data.subject,
				mockJob.data.html
			)
			expect(mailService.send).toHaveBeenCalledTimes(1)
		})

		it('Should log an error message if mailService.send fails', async () => {
			const error = new Error('SMTP Timeout')
			const loggerSpy = jest
				.spyOn(Logger.prototype, 'error')
				.mockImplementation()
			mockMailService.send.mockRejectedValue(error)

			await processor.process(mockJob)

			expect(loggerSpy).toHaveBeenCalledWith(
				expect.stringContaining(
					`❌ Error sending email to ${mockJob.data.email}: ${error.message}`
				)
			)
			await expect(processor.process(mockJob)).resolves.not.toThrow()
		})
	})
})
