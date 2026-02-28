import { MailerService as Transporter } from '@nestjs-modules/mailer'
import { getQueueToken } from '@nestjs/bullmq'
import { Test, TestingModule } from '@nestjs/testing'

import { MailerService } from '@/infrastructure/mail/mailers/mailer.service'
import { MailProps } from '@/infrastructure/mail/types/mail.types'

describe('MailerService', () => {
	let service: MailerService
	let queue: any
	let transporter: any

	const mockQueue = {
		add: jest.fn()
	}

	const mockTransporter = {
		sendMail: jest.fn()
	}

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				MailerService,
				{
					provide: Transporter,
					useValue: mockTransporter
				},
				{
					provide: getQueueToken('mail'),
					useValue: mockQueue
				}
			]
		}).compile()

		service = module.get<MailerService>(MailerService)
		queue = module.get(getQueueToken('mail'))
		transporter = module.get(Transporter)

		jest.clearAllMocks()
	})

	describe('Add mail to queue', () => {
		it('Should add a job to the "mail" queue with correct data and options', async () => {
			const mailProps: MailProps = {
				email: 'user@example.com',
				subject: 'Welcome!',
				html: '<h1>Hello</h1>'
			}

			const result = await service.addMailToQueue(mailProps)

			expect(result).toBe(true)
			expect(queue.add).toHaveBeenCalledWith(
				'send-email',
				{
					email: mailProps.email,
					subject: mailProps.subject,
					html: mailProps.html
				},
				{ removeOnComplete: true }
			)
		})
	})

	describe('Send email', () => {
		it('Should call the transporter with the correct email parameters', async () => {
			const email = 'test@test.com'
			const subject = 'Test Subject'
			const html = '<p>Test Content</p>'

			await service.send(email, subject, html)

			expect(transporter.sendMail).toHaveBeenCalledWith({
				to: email,
				subject,
				html
			})
		})

		it('Should propagate errors from the transporter', async () => {
			transporter.sendMail.mockRejectedValue(new Error('SMTP Error'))

			await expect(
				service.send('a@b.com', 'sub', 'html')
			).rejects.toThrow('SMTP Error')
		})
	})
})
