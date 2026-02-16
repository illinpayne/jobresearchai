import type {
	ChangeAvatarRequest,
	ChangePersonalDataRequest,
	GetMeRequest
} from '@jrai/contracts/gen/account'
import {
	Body,
	Controller,
	Get,
	HttpCode,
	HttpStatus,
	NotFoundException,
	Put,
	UploadedFile,
	UseInterceptors
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import {
	ApiBearerAuth,
	ApiInternalServerErrorResponse,
	ApiNotFoundResponse,
	ApiOkResponse,
	ApiOperation,
	ApiUnauthorizedResponse
} from '@nestjs/swagger'

import { CurrentUser, Protected } from '@/common/decorators'

import { AccountClientGrpc } from './account.grpc'
import { ChangePersonalDataDto } from './dtos/change-personal-data.dto'
import { AccountResponse } from './responses/account.response'

@Controller('account')
export class AccountController {
	constructor(private readonly client: AccountClientGrpc) {}

	@ApiOperation({
		summary: 'Account session data',
		description: 'Provides authenticated account data'
	})
	@ApiOkResponse({
		description: 'Returns account data',
		type: AccountResponse
	})
	@ApiUnauthorizedResponse({ description: 'Unauthorized' })
	@ApiInternalServerErrorResponse({
		description: 'Failed to get personal data'
	})
	@ApiBearerAuth()
	@Protected()
	@Get('me')
	@HttpCode(HttpStatus.OK)
	async getMe(@CurrentUser('id') id: string) {
		return await this.client.call('getMe', { id } as GetMeRequest)
	}

	@ApiOperation({
		summary: 'Change personal data',
		description: 'Updates personal information about customer'
	})
	@ApiOkResponse({
		description: 'Returns account data',
		type: AccountResponse
	})
	@ApiUnauthorizedResponse({ description: 'Unauthorized' })
	@ApiNotFoundResponse({
		description: 'Account not found'
	})
	@ApiInternalServerErrorResponse({
		description: 'Failed to get personal data'
	})
	@ApiBearerAuth()
	@Protected()
	@Put('personal-data')
	@HttpCode(HttpStatus.OK)
	async updatePersonalData(
		@CurrentUser('id') id: string,
		@Body() dto: ChangePersonalDataDto
	) {
		return await this.client.call('changePersonalData', {
			id,
			...dto
		} as ChangePersonalDataRequest)
	}

	@ApiOperation({
		summary: 'Change avatar profile',
		description: 'Change customer avatar'
	})
	@ApiOkResponse({
		description: 'Returns account data',
		type: AccountResponse
	})
	@ApiUnauthorizedResponse({ description: 'Unauthorized' })
	@ApiNotFoundResponse({
		description: 'Account not found'
	})
	@ApiInternalServerErrorResponse({
		description: 'Failed to get personal data'
	})
	@ApiBearerAuth()
	@Protected()
	@UseInterceptors(FileInterceptor('avatar'))
	@Put('change-avatar')
	@HttpCode(HttpStatus.OK)
	async changeProfileAvatar(
		@CurrentUser('id') id: string,
		@UploadedFile() file: Express.Multer.File
	) {
		//TODO: do the stuff with saving, getting db name (only name, no extension)
		// Geneate the name which will be using in a URL template
		// Example: https://cdn.s3.com/uploads/users/<gotten_name>.pmg
		if (!file) {
			throw new NotFoundException('Image not found')
		}
		return await this.client.call('changeAvatar', {
			id,
			avatar: file.originalname
		} as ChangeAvatarRequest)
	}
}
