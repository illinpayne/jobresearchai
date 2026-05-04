import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'

import { PrismaClient } from './generated/client'
import { AiModelPresetCreateInput } from './generated/models'

const pool = new Pool({ connectionString: process.env.DATABASE_URL })
const adapter = new PrismaPg(pool)

const prisma = new PrismaClient({ adapter })

async function main() {
	if ((await prisma.aiExternalModel.count()) === 0) {
		console.log('🌱 Seeding AI Models and Presets...')
		const gemma9 = await prisma.aiExternalModel.upsert({
			where: { name: 'google/gemma-2-9b' },
			update: {},
			create: { name: 'google/gemma-2-9b' }
		})
		const gemma4_e2b = await prisma.aiExternalModel.upsert({
			where: { name: 'google/gemma-4-e2b' },
			update: {},
			create: { name: 'google/gemma-4-e2b' }
		})

		const freePresets: AiModelPresetCreateInput[] = [
			{
				name: 'Junkie 1.1 Shallower',
				description:
					'Standard ATS engine optimized for balanced keyword extraction and fair scoring.',
				stars: 3,
				usageCredits: 10,
				paidTier: 'Free',
				temperature: 0.0,
				maxTokens: 1000,
				systemPrompt: `Role: Fast Extraction Bot.
Strategy: Be literal. Copy data exactly as written. 
Logic: Minimize reasoning. Tag mentioned skills only. Use immediate market minimums for salary. 
Tone: Short, robotic summary.`,
				aiExternalModel: {
					connect: {
						id: gemma4_e2b.id
					}
				}
			},
			{
				name: 'Junkie 1.2 Thinker',
				description:
					'Advanced free-tier reasoning model that analyzes achievement impact to predict career growth.',
				stars: 5,
				usageCredits: 30,
				paidTier: 'Free',
				systemPrompt: `Role: HR Assistant. 
Strategy: Professional review. 
Logic: Group related technologies into tags. Predict logical next-step career paths (e.g., Junior to Mid). 
Tone: Balanced, objective summary for human recruiters.`,
				maxTokens: 1200,
				temperature: 0.1,
				aiExternalModel: {
					connect: {
						id: gemma4_e2b.id
					}
				}
			}
		]

		const proPresets: AiModelPresetCreateInput[] = [
			{
				name: 'Junkie 2.1 Visionary',
				description:
					'High-efficiency predictive analysis. Uses high-end reasoning to map candidate potential to 5-year career paths.',
				stars: 4,
				usageCredits: 60,
				paidTier: 'Pro',
				temperature: 0.1,
				maxTokens: 2000,
				systemPrompt: `
# IDENTITY
Senior Executive Career Architect. 

# LOGIC
Focus on "Hidden Signals": identify skills implied by achievements but not explicitly named. Your 'predicatedPosition' must represent an ambitious 2-year career leap. Prioritize high-level architectural 'tags'.
        `.trim(),
				aiExternalModel: {
					connect: {
						id: gemma9.id
					}
				}
			},
			{
				name: 'Junkie 1.4 Expert',
				description:
					'The Brutal Technical Auditor. Specialized in detecting "fluff" and providing uncompromising technical validation.',
				stars: 4,
				usageCredits: 100,
				paidTier: 'Pro',
				temperature: 0.7,
				maxTokens: 3000,
				systemPrompt: `
# IDENTITY
Cynical Technical Auditor. 

# LOGIC
Strict Fluff Detection: If an achievement lacks metrics, ignore it. Your 'resumeScore' must be merciless—penalize heavily for generic buzzwords. The 'summary' should be a blunt, cold critique of technical gaps.
        `.trim(),
				aiExternalModel: {
					connect: {
						id: gemma9.id
					}
				}
			}
		]

		for (const preset of freePresets) {
			await prisma.aiModelPreset.upsert({
				where: { name: preset.name },
				update: {
					...preset
				},
				create: preset
			})
		}
		for (const preset of proPresets) {
			await prisma.aiModelPreset.upsert({
				where: { name: preset.name },
				update: {
					...preset
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
