import { IsBoolean, IsNotEmpty, IsNumber, IsString } from 'class-validator'

export class SmtpValidator {
	@IsString()
	@IsNotEmpty()
	public SMTP_HOST: string

	@IsNumber()
	@IsNotEmpty()
	public SMTP_PORT: number

	@IsString()
	@IsNotEmpty()
	public SMTP_USERNAME: string

	@IsString()
	@IsNotEmpty()
	public SMTP_PASSWORD: string

	@IsString()
	@IsNotEmpty()
	public SMTP_FROM_ADDRESS: string

	@IsBoolean()
	public SMTP_SECURE: boolean

	@IsString()
	@IsNotEmpty()
	public SMTP_RESEND_API_TOKEN: string
}
