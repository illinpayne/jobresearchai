import { ApiProperty } from '@nestjs/swagger'

export class SendOtpRegisterResponse {
	@ApiProperty({ type: Boolean, default: true })
	status: boolean

	@ApiProperty({
		type: String,
		example: 'OTP code was sent on the tony.soprano@gmail.com'
	})
	message: string
}
