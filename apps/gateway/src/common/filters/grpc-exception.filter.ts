import { grpcToHttpStatus } from '@jrai/contracts/grpc'
import {
	ArgumentsHost,
	Catch,
	ExceptionFilter,
	HttpException,
	HttpStatus
} from '@nestjs/common'
import type { Response } from 'express'

@Catch()
export class GrpcExceptionFilter implements ExceptionFilter {
	public catch(exception: any, host: ArgumentsHost) {
		const ctx = host.switchToHttp()
		const response = ctx.getResponse<Response>()

		if (this.isGrpcError(exception)) {
			const status = grpcToHttpStatus[exception.code] || 500

			//TODO: Typize this stuff
			return response.status(status).json({
				statusCode: status,
				message: exception.details || 'Service unavailable'
			})
		}

		if (exception instanceof HttpException) {
			const status = exception.getStatus()

			//TODO: Typize this stuff
			return response
				.status(status)
				.json({ statusCode: status, message: exception.message })
		}

		//TODO: Typize this stuff
		return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
			statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
			message: 'Internal Server Error'
		})
	}

	private isGrpcError(exception: any) {
		return (
			typeof exception === 'object' &&
			'code' in exception &&
			'details' in exception
		)
	}
}
