import { S3ClientConfig } from '@aws-sdk/client-s3'
import { ConfigService } from '@nestjs/config'

import { AllConfigs } from '../interfaces'

export const getS3Config = (
	configService: ConfigService<AllConfigs>
): S3ClientConfig => ({
	region: configService.get('aws.region', { infer: true }),
	credentials: {
		accessKeyId: configService.get('aws.accessKeyId', {
			infer: true
		}) as string,
		secretAccessKey: configService.get('aws.secretAccessKey', {
			infer: true
		}) as string
	}
})
