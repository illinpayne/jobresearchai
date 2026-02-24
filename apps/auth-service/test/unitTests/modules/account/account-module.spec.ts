import { Test, TestingModule } from '@nestjs/testing'
import { Account } from '@prisma/generated/browser'

import { PrismaService } from '@/infrastructure/prisma/prisma.service'
import { AccountRepository } from '@/modules/account/account.repository'
import { AccountService } from '@/modules/account/account.service'

import { expectNotFound, expectUnauthenticated } from '../../../shared/index'

jest.mock('@/infrastructure/prisma/prisma.service', () => {
	return {
		PrismaService: jest.fn().mockImplementation(() => mockPrisma)
	}
})
const mockPrisma = {
	account: {
		findUnique: jest.fn(),
		update: jest.fn()
	}
}

describe('Account Module', () => {
	let service: AccountService
	let account: Account = {
		id: 'userId',
		email: 'mock@gmail.com',
		passwordHash: 'hashpassword',
		firstName: 'Vito',
		secondName: 'Cornleone',
		avatar: 'https://jrai.s3.amazonaws.com/avatars/default.png',
		isAuthVerified: true,
		role: 'CUSTOMER',
		isEmailVerified: true,
		createdAt: new Date('2026-01-01T00:00:00.000Z'),
		updatedAt: new Date('2026-01-01T00:00:00.000Z')
	}

	beforeEach(async () => {
		jest.spyOn(console, 'log').mockImplementation(() => {})

		const module: TestingModule = await Test.createTestingModule({
			providers: [
				AccountService,
				AccountRepository,
				{
					provide: PrismaService,
					useValue: mockPrisma
				}
			]
		}).compile()

		service = module.get<AccountService>(AccountService)
	})

	afterEach(() => {
		jest.restoreAllMocks()
	})

	it('Should get account human data', async () => {
		mockPrisma.account.findUnique.mockResolvedValue(account)
		const response = await service.getMe(account.id)

		expect(response?.email).toBe(account.email)
		expect(response?.firstName).toBe(account.firstName)
		expect(response?.secondName).toBe(account.secondName)
		expect(response?.avatar).toBe(account.avatar)
	})

	it('Should throw authenticate error when account is not found', async () => {
		mockPrisma.account.findUnique.mockResolvedValue(null)
		try {
			await service.getMe(account.id)
		} catch (error) {
			expectUnauthenticated(error, 'Account was deleted')
		}
	})

	it('Should update personal data', async () => {
		const modifiedAccount = {
			...account,
			firstName: 'test-fn',
			secondName: 'test-sn'
		}
		mockPrisma.account.findUnique.mockResolvedValue(account)
		mockPrisma.account.update.mockResolvedValue(modifiedAccount)
		const response = await service.changePersonalData({
			id: account.id,
			firstName: 'test-fn',
			secondName: 'test-sn'
		})

		expect(response?.email).toBe(account.email)
		expect(response?.firstName).toBe(modifiedAccount.firstName)
		expect(response?.secondName).toBe(modifiedAccount.secondName)
	})

	it('Should throw not found account while update personal data', async () => {
		mockPrisma.account.findUnique.mockResolvedValue(null)

		try {
			await service.changePersonalData({
				id: account.id,
				firstName: 'test-fn',
				secondName: 'test-sn'
			})
		} catch (error) {
			expectNotFound(error, 'Account not found')
		}
	})

	it('Should update avatar', async () => {
		const modifiedAccount = {
			...account,
			avatar: 'new-avatar-name'
		}
		mockPrisma.account.findUnique.mockResolvedValue(account)
		mockPrisma.account.update.mockResolvedValue(modifiedAccount)

		const response = await service.changeAvatar({
			id: account.id,
			avatar: 'new-avatar-name'
		})

		expect(response?.email).toBe(account.email)
		expect(response?.avatar).toBe(modifiedAccount.avatar)
	})

	it('Should throw not found error while update avatar', async () => {
		mockPrisma.account.findUnique.mockResolvedValue(null)

		try {
			await service.changeAvatar({
				id: account.id,
				avatar: 'test-avatar-name'
			})
		} catch (error) {
			expectNotFound(error, 'Account not found')
		}
	})
})
