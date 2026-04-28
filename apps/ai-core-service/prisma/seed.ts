import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'

import { PrismaClient } from './generated/client'

const pool = new Pool({ connectionString: process.env.DATABASE_URL })
const adapter = new PrismaPg(pool)

const prisma = new PrismaClient({ adapter })

async function main() {
	if ((await prisma.aiExternalModel.count()) === 0) {
		console.log('🌱 Seeding AI Models and Presets...')
		const gemma = await prisma.aiExternalModel.upsert({
			where: { name: 'google/gemma-2-9b' },
			update: {},
			create: { name: 'google/gemma-2-9b' }
		})

		const qwen = await prisma.aiExternalModel.upsert({
			where: { name: 'qwen/qwen2.5-vl-7b' },
			update: {},
			create: { name: 'qwen/qwen2.5-vl-7b' }
		})

		const presets = [
			{
				name: 'Gemma Balanced',
				description:
					'Standard preset for general purpose chat using Gemma 2.',
				stars: 5,
				usageTokens: 15,
				paidTier: 'FREE',
				temperature: 0.7,
				aiExternalModelId: gemma.id
			},
			{
				name: 'Gemma Precise',
				description: 'Low temperature setting for factual extraction.',
				stars: 4,
				usageTokens: 12,
				paidTier: 'BASIC',
				temperature: 0.1,
				aiExternalModelId: gemma.id
			},
			{
				name: 'Qwen Vision Pro',
				description:
					'Optimized for visual-language tasks and image descriptions.',
				stars: 5,
				usageTokens: 25,
				paidTier: 'PREMIUM',
				temperature: 0.4,
				aiExternalModelId: qwen.id
			}
		]

		for (const preset of presets) {
			await prisma.aiModelPreset.upsert({
				where: { name: preset.name },
				update: {
					description: preset.description,
					stars: preset.stars,
					usageTokens: preset.usageTokens,
					paidTier: preset.paidTier,
					temperature: preset.temperature
				},
				create: preset
			})
		}
		console.log('✅ Seeding complete!')
	} else {
		console.log('🌱 Data already seeded!')
	}
}

main()
	.then(async () => {
		await prisma.$disconnect()
	})
	.catch(async e => {
		console.error(e)
		await prisma.$disconnect()
		process.exit(1)
	})
