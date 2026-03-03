import { registerAs } from '@nestjs/config'

import { AwsConfig } from '../interfaces/aws.interface'
import { validateEnv } from '../utils/env'
import { AwsValidator } from '../validators'

export const awsEnv = registerAs<AwsConfig>('aws', () => {
	validateEnv(process.env, AwsValidator)

	return {
		region: process.env.AWS_REGION as string,
		accessKeyId: process.env.AWS_ACCESS_KEY_ID as string,
		secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
		bucketName: process.env.AWS_BUCKET_NAME as string
	} as AwsConfig
})
