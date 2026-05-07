import { grpcToHttpStatus } from '@jrai/contracts/grpc'
import {
	ArgumentsHost,
	Catch,
	ExceptionFilter,
	HttpException,
	HttpStatus
} from '@nestjs/common'
import type { Response } from 'express'

import { IGrpcExceptionBody } from '@/shared/filters.types'

@Catch()
export class GrpcExceptionFilter implements ExceptionFilter {
	public catch(exception: any, host: ArgumentsHost) {
		const ctx = host.switchToHttp()
		const response = ctx.getResponse<Response>()
		if (this.isGrpcError(exception)) {
			const status = grpcToHttpStatus[exception.code] || 500

			const message = (exception.details as string).includes(
				'ECONNREFUSED'
			)
				? 'Service unavailable, try again later'
				: exception.details

			return response.status(status).json({
				statusCode: status,
				message: message
			} as IGrpcExceptionBody)
		}

		if (exception instanceof HttpException) {
			const status = exception.getStatus()

			return response.status(status).json({
				statusCode: status,
				message: exception.message
			} as IGrpcExceptionBody)
		}

		return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
			statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
			message: exception?.message ?? 'Internal Server Error'
		} as IGrpcExceptionBody)
	}

	private isGrpcError(exception: any) {
		return (
			typeof exception === 'object' &&
			'code' in exception &&
			'details' in exception
		)
	}
}
