import { OtpRequestEvent } from '@jrai/contracts'
import { Test, TestingModule } from '@nestjs/testing'
import { render } from '@react-email/render'

import { MailService } from '@/common/abstractions/mail.service.abstract'
import { AuthNotificationsService } from '@/modules/auth-notifications/auth-notifications.service'

jest.mock('@react-email/render', () => ({
	render: jest.fn().mockResolvedValue('<html>Mocked Email Content</html>')
}))

describe('Auth notification service', () => {
	let service: AuthNotificationsService
	let mailService: MailService

	const mockMailService = {
		addMailToQueue: jest.fn().mockResolvedValue(true)
	}

	const mockOtpEvent: OtpRequestEvent = {
		email: 'test@example.com',
		code: '123456'
	}

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				AuthNotificationsService,
				{ provide: MailService, useValue: mockMailService }
			]
		}).compile()

		service = module.get<AuthNotificationsService>(AuthNotificationsService)
		mailService = module.get<MailService>(MailService)

		jest.clearAllMocks()
	})

	describe('Send register OTP', () => {
		it('Should render the Register template and add it to the mail queue', async () => {
			const result = await service.sendRegisterOtp(mockOtpEvent)

			expect(render).toHaveBeenCalled()
			expect(mailService.addMailToQueue).toHaveBeenCalledWith({
				email: mockOtpEvent.email,
				subject: 'Register verification',
				html: '<html>Mocked Email Content</html>'
			})
			expect(result).toBe(true)
		})
	})

	describe('Send forgot password OTP', () => {
		it('should render the ForgotPassword template and add it to the mail queue', async () => {
			await service.sendForgotPasswordOtp(mockOtpEvent)

			expect(render).toHaveBeenCalled()
			expect(mailService.addMailToQueue).toHaveBeenCalledWith({
				email: mockOtpEvent.email,
				subject: 'Forgot your password?',
				html: '<html>Mocked Email Content</html>'
			})
		})
	})

	describe('Send change email OTP', () => {
		it('should render the ChangeEmail template and add it to the mail queue', async () => {
			await service.sendChangeEmailOtp(mockOtpEvent)

			expect(render).toHaveBeenCalled()
			expect(mailService.addMailToQueue).toHaveBeenCalledWith({
				email: mockOtpEvent.email,
				subject: 'Email verification',
				html: '<html>Mocked Email Content</html>'
			})
		})
	})
})
