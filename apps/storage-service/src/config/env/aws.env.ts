import { registerAs } from '@nestjs/config'

import { AwsConfig } from '../interfaces/aws.interface'
import { validateEnv } from '../utils/env'
import { AwsValidator } from '../validators'

export const awsEnv = registerAs<AwsConfig>('aws', () => {
	validateEnv(process.env, AwsValidator)

	return {
		region: process.env.STORAGE_AWS_REGION as string,
		accessKeyId: process.env.STORAGE_AWS_ACCESS_KEY_ID as string,
		secretAccessKey: process.env.STORAGE_AWS_SECRET_ACCESS_KEY as string,
		bucketName: process.env.STORAGE_AWS_BUCKET_NAME as string,
		endpoint: process.env.STORAGE_AWS_ENDPOINT,
		forcePathStyle: process.env.STORAGE_AWS_FORCE_PATH_STYLE === 'true'
	} as AwsConfig
})
