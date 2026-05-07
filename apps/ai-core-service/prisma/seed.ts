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
				systemPrompt:
					`Role: Data Parser. Task: Review CV very shallow, provide few tags, achivements. Logic: no inference.`.trim(),
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
				systemPrompt:
					`Role: HR Screener. Task: Balanced CV Review. Logic: Predict next career step, provide medium amont of tags, achivements. Summarize impact.`.trim(),
				maxTokens: 1200,
				temperature: 0.3,
				aiExternalModel: {
					connect: {
						id: gemma4_e2b.id
					}
				}
			}
		]

		const proPresets: AiModelPresetCreateInput[] = [
			{
				name: 'Junkie 2.3 Visionary',
				description:
					'High-efficiency predictive analysis. Uses high-end reasoning to map candidate potential to 5-year career paths.',
				stars: 4,
				usageCredits: 60,
				paidTier: 'Pro',
				temperature: 0.7,
				maxTokens: 2300,
				systemPrompt:
					`Role: Career Strategist. Task: High-potential analysis. Strategy: Future-casting. Logic: Identify 'hidden' skills and suggest ambitious career paths. Creative tagging.`.trim(),
				aiExternalModel: {
					connect: {
						id: gemma9.id
					}
				}
			},
			{
				name: 'Junkie 2.4 Expert',
				description:
					'The Brutal Technical Auditor. Specialized in detecting "fluff" and providing uncompromising technical validation.'.trim(),
				stars: 4,
				usageCredits: 100,
				paidTier: 'Pro',
				temperature: 0.2,
				maxTokens: 2900,
				systemPrompt:
					`Role: Domain Talent Lead. Task: Heuristic Assessment. Logic: Cluster skills by functional area (e.g., Clinical, Operational, Technical). Cross-reference seniority level against total years of experience to validate expertise.`.trim(),
				aiExternalModel: {
					connect: {
						id: gemma9.id
					}
				}
			},
			{
				name: 'Junkie 2.5 Paradox',
				description:
					'Experimental free reasoning model that can finds out unexpectable things.',
				stars: 5,
				usageCredits: 110,
				paidTier: 'Pro',
				systemPrompt: `Role: Chaos Strategist. 
Task: Radical Subtext Inference. 
Strategy: Lateral Thinking. 
Logic: Ignore the obvious titles. Connect disparate dots (e.g., if a Soldier mentions "negotiation," infer "Diplomatic Liaison" potential). Find the "Ghost Skillset" hidden between the lines. Identify high-value talents that are hinted at but not explicitly named.
Goal: Provide unexpected but viable "predicatedPosition" and "tags" that reflect a hidden, high-earning potential.
Currency: Convert all local salary expectations to USD (~40:1).`.trim(),
				ownRule: `# 1. GATEKEEPER
* **VALIDATION**: If the text is not a resume, return \`resumeScore: 0\`. Stop immediately.

# 2. THE PARADOX LOGIC
* **PREDICATED POSITION**: Do NOT just copy their current role. Identify a "Pivot Role"—a career path they are qualified for but haven't explored yet.
* **TAGS**: Include 3 "Standard" tags and 3 "Hidden Talent" tags (e.g., "Crisis Management," "Psychological Resilience," "Strategic Intuition").
* **SUMMARY**: Write a 2-sentence summary that highlights their "Hidden Power."
* **JSON**: Return ONLY raw JSON. No markdown blocks. No prose.
* **SALARY**: Estimate the USD market value for the "Pivot Role" you identified.
* **FALLBACKS**: Use "Not specified" for strings, 0 for numbers. No nulls.`.trim(),
				maxTokens: 2800,
				temperature: 1,
				aiExternalModel: {
					connect: {
						id: gemma4_e2b.id
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
