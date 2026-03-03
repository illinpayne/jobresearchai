import type {
	ChangeAvatarRequest,
	ChangePersonalDataRequest,
	GetMeRequest
} from '@jrai/contracts/gen/account'
import {
	Body,
	Controller,
	FileTypeValidator,
	Get,
	HttpCode,
	HttpStatus,
	MaxFileSizeValidator,
	NotFoundException,
	ParseFilePipe,
	Put,
	UploadedFile,
	UseInterceptors
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import {
	ApiBearerAuth,
	ApiBody,
	ApiConsumes,
	ApiInternalServerErrorResponse,
	ApiNotFoundResponse,
	ApiOkResponse,
	ApiOperation,
	ApiUnauthorizedResponse
} from '@nestjs/swagger'

import { CurrentUser, Protected } from '@/common/decorators'

import { StorageClientGrpc } from '../storage/storage.grpc'

import { AccountClientGrpc } from './account.grpc'
import { ChangePersonalDataDto } from './dtos/change-personal-data.dto'
import { AccountResponse } from './responses/account.response'

@Controller('account')
export class AccountController {
	constructor(
		private readonly authClient: AccountClientGrpc,
		private readonly storageClient: StorageClientGrpc
	) {}

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
		return await this.authClient.call('getMe', { id } as GetMeRequest)
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
		return await this.authClient.call('changePersonalData', {
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
	@ApiConsumes('multipart/form-data')
	@ApiBody({
		schema: {
			type: 'object',
			properties: {
				file: {
					type: 'string',
					format: 'binary'
				}
			}
		}
	})
	@Protected()
	@UseInterceptors(FileInterceptor('avatar'))
	@Put('change-avatar')
	@HttpCode(HttpStatus.OK)
	async changeProfileAvatar(
		@CurrentUser('id') id: string,
		@UploadedFile(
			new ParseFilePipe({
				validators: [
					new FileTypeValidator({
						fileType: '.(png|jpeg|jpg|webp)$'
					}),
					new MaxFileSizeValidator({ maxSize: 5 * 1024 * 1024 })
				]
			})
		)
		file: Express.Multer.File
	) {
		if (!file) {
			throw new NotFoundException('Image not found')
		}

		const user = await this.authClient.call('getMe', { id } as GetMeRequest)

		const saveResponse = await this.storageClient.call('saveAvatar', {
			data: file.buffer,
			mimetype: file.mimetype
		})
		await this.storageClient.call('removeAvatar', {
			fileName: user.avatar
		})

		return await this.authClient.call('changeAvatar', {
			id,
			avatar: saveResponse.fileName
		} as ChangeAvatarRequest)
	}
}
