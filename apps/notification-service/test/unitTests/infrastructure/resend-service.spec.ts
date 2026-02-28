import { getQueueToken } from '@nestjs/bullmq'
import { ConfigService } from '@nestjs/config'
import { Test, TestingModule } from '@nestjs/testing'

import { ResendService } from '@/infrastructure/mail/mailers/resend.service'

// 1. Mock the Resend library globally
jest.mock('resend', () => {
	return {
		Resend: jest.fn().mockImplementation(() => ({
			emails: {
				send: jest.fn()
			}
		}))
	}
})

describe('ResendService', () => {
	let service: ResendService
	let queue: any
	let mockResendInstance: any

	const mockQueue = {
		add: jest.fn()
	}

	const mockConfigService = {
		get: jest.fn((key: string) => {
			if (key === 'smtp.resend_api_token') return 're_test_token'
			if (key === 'smtp.from_address') return 'no-reply@test.com'
			return null
		})
	}

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				ResendService,
				{ provide: ConfigService, useValue: mockConfigService },
				{ provide: getQueueToken('mail'), useValue: mockQueue }
			]
		}).compile()

		service = module.get<ResendService>(ResendService)
		queue = module.get(getQueueToken('mail'))

		mockResendInstance = (service as any).transporter

		jest.clearAllMocks()
	})

	describe('Resend mail queue', () => {
		it('Should add the job to BullMQ with the correct payload', async () => {
			const payload = {
				email: 'test@user.com',
				subject: 'Hi',
				html: '<b>Test</b>'
			}

			const result = await service.addMailToQueue(payload)

			expect(result).toBe(true)
			expect(queue.add).toHaveBeenCalledWith('send-email', payload, {
				removeOnComplete: true
			})
		})
	})

	describe('Resend send', () => {
		it('Should call resend.emails.send with correctly formatted data', async () => {
			const email = 'target@example.com'
			const subject = 'Test Subject'
			const html = '<p>Content</p>'

			await service.send(email, subject, html)

			expect(mockResendInstance.emails.send).toHaveBeenCalledWith({
				from: `JobResearcher AI <no-reply@test.com>`,
				to: email,
				subject,
				html
			})
		})

		it('Should properly handle a Resend API error', async () => {
			mockResendInstance.emails.send.mockRejectedValue(
				new Error('API Key Invalid')
			)

			await expect(service.send('a@b.com', 's', 'h')).rejects.toThrow(
				'API Key Invalid'
			)
		})
	})
})
