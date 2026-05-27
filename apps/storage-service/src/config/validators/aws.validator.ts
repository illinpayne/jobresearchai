import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator'

export class AwsValidator {
	@IsString()
	@IsNotEmpty()
	public STORAGE_AWS_REGION: string

	@IsString()
	@IsNotEmpty()
	public STORAGE_AWS_ACCESS_KEY_ID: string

	@IsString()
	@IsNotEmpty()
	public STORAGE_AWS_SECRET_ACCESS_KEY: string

	@IsString()
	@IsNotEmpty()
	public STORAGE_AWS_BUCKET_NAME: string

	@IsString()
	@IsOptional()
	@IsNotEmpty()
	public STORAGE_AWS_ENDPOINT: string

	@IsBoolean()
	@IsNotEmpty()
	public STORAGE_AWS_FORCE_PATH_STYLE: boolean
}
