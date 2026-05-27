import { IsBoolean, IsNotEmpty, IsNumber, IsString } from 'class-validator'

export class SmtpValidator {
	@IsString()
	@IsNotEmpty()
	public NOTIFICATION_SMTP_HOST: string

	@IsNumber()
	@IsNotEmpty()
	public NOTIFICATION_SMTP_PORT: number

	@IsString()
	@IsNotEmpty()
	public NOTIFICATION_SMTP_USERNAME: string

	@IsString()
	@IsNotEmpty()
	public NOTIFICATION_SMTP_PASSWORD: string

	@IsString()
	@IsNotEmpty()
	public NOTIFICATION_SMTP_FROM_ADDRESS: string

	@IsBoolean()
	public NOTIFICATION_SMTP_SECURE: boolean

	@IsString()
	@IsNotEmpty()
	public NOTIFICATION_SMTP_RESEND_API_TOKEN: string
}
