export interface SmtpConfig {
	host: string
	port: number
	username: string
	password: string
	from_address: string
	secure: boolean
	resend_api_token: string
}
