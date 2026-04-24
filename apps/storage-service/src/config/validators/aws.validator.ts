import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator'

export class AwsValidator {
	@IsString()
	@IsNotEmpty()
	public AWS_REGION: string

	@IsString()
	@IsNotEmpty()
	public AWS_ACCESS_KEY_ID: string

	@IsString()
	@IsNotEmpty()
	public AWS_SECRET_ACCESS_KEY: string

	@IsString()
	@IsNotEmpty()
	public AWS_BUCKET_NAME: string

	@IsString()
	@IsOptional()
	@IsNotEmpty()
	public AWS_ENDPOINT: string

	@IsBoolean()
	@IsNotEmpty()
	public AWS_FORCE_PATH_STYLE: boolean
}
