import { RedisService } from '@/infrastructure/redis/redis.service'
import { OTPGeneratedCode } from '@/shared/otp.types'
import { GrpcException, RpcStatus } from '@jrai/contracts/grpc'
import { Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices'
import { createHash } from 'crypto'
import {generateCode as generatePatcode} from 'patcode'

@Injectable()
export class OtpService {
	public constructor(private readonly redis: RedisService) {}

	public async send(key: string, type: string) : Promise<OTPGeneratedCode> {
		const {code, hash} = this.generateCode();

		await this.redis.set(`otp:${type}:${key}`, hash, 'EX', 300);

		return {
			code, hash
		}
	}

	public async verify(key: string, type: string, code: string) : Promise<boolean> {
		const storedCode = await this.redis.get(`otp:${type}:${key}`);
		if (!storedCode) {
			throw new GrpcException(RpcStatus.ABORTED, 'Expired code');
		}

		const incomingHash = createHash('sha256').update(String(code)).digest('hex');
		if (incomingHash !== storedCode) {
			throw new GrpcException(RpcStatus.ABORTED, 'Invalid or expired code');
		}

		await this.redis.del(`otp"${type}:${key}`);

		return true;
	}

	private generateCode(): OTPGeneratedCode {
		const code = generatePatcode();
		const hash = createHash('sha256').update(String(code)).digest('hex');

		return {
			code, hash
		}

	}
}
