import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'

import { PrismaClient } from './generated/client'
import { BundleCreateInput, PlanCreateInput } from './generated/models'

const url = process.env.DATABASE_URL
console.log('Connection: ', url)
const pool = new Pool({ connectionString: url })
const adapter = new PrismaPg(pool)

const prisma = new PrismaClient({ adapter })

const PLANS: PlanCreateInput[] = [
	{
		name: 'Basic',
		grantedCredits: 250,
		trialDays: 7,
		stripePriceMonthlyId: 'price_1TX6XKGly7U8J4pxBC5gLbAB',
		stripePriceAnnualId: 'price_1TX6XbGly7U8J4pxjDTYraBW',
		monthlyPrice: 5,
		annualPrice: 60,
		description: 'Everything you need to get started.',
		benefits: [
			'Up to 2 AI models',
			'250 montly credits',
			'Trial for 7 days'
		]
	},
	{
		name: 'Pro',
		grantedCredits: 490,
		trialDays: 3,
		stripePriceMonthlyId: 'price_1TVnftGly7U8J4pxoho8NzJZ',
		stripePriceAnnualId: 'price_1TVpbGGly7U8J4pxH1GIYjbZ',
		monthlyPrice: 10,
		annualPrice: 96,
		description: 'For growing teams that need more power and flexibility.',
		benefits: [
			'Up to 5 AI models',
			'490 montly credits',
			'Trial for 3 days',
			'Email support',
			'Getting more relevant jobs'
		]
	},
	{
		name: 'Ultimate',
		grantedCredits: 1100,
		stripePriceMonthlyId: 'price_1TVnghGly7U8J4pxq4QcMvEM',
		stripePriceAnnualId: 'price_1TVpabGly7U8J4pxcST5sQkq',
		monthlyPrice: 25,
		annualPrice: 240,
		description: 'Large grade for lots of snapshots of the same CV.',
		benefits: [
			'Everything from Pro',
			'All pro-tier AI models',
			'1100 montly credits',
			'Getting full information from CV',
			'Placing in the fastest scan queue'
		]
	}
]

const BUNDLES: BundleCreateInput[] = [
	{
		name: 'Quick reviewing',
		credits: 50,
		price: 2,
		stripePriceId: 'price_1TX2z8Gly7U8J4pxL1PZIxYL',
		description: 'Perfect for one-time thinking to get maximum result.'
	},
	{
		name: 'Improve reviewing',
		credits: 120,
		price: 12,
		stripePriceId: 'price_1TX33TGly7U8J4pxuYHZE1kg',
		description: 'Get scanned a couple of resumes for the best decision.'
	},
	{
		name: 'HR reviewing',
		credits: 290,
		price: 20,
		stripePriceId: 'price_1TX32BGly7U8J4pxIpxmcjM4',
		description:
			'Review several snapshots of the same resume for getting incredible result.'
	}
]

async function seedPlans() {
	console.log('Seeding plans…')
	for (const plan of PLANS) {
		await prisma.plan.upsert({
			where: { name: plan.name },
			create: plan,
			update: {
				grantedCredits: plan.grantedCredits,
				trialDays: plan.trialDays,
				stripePriceMonthlyId: plan.stripePriceMonthlyId,
				stripePriceAnnualId: plan.stripePriceAnnualId,
				description: plan.description,
				monthlyPrice: plan.monthlyPrice,
				annualPrice: plan.annualPrice,
				benefits: plan.benefits
			}
		})
		console.log(`  ✓ ${plan.name}`)
	}
}

async function seedBundles() {
	console.log('Seeding bundles…')
	for (const bundle of BUNDLES) {
		await prisma.bundle.upsert({
			where: { name: bundle.name },
			create: bundle,
			update: {
				credits: bundle.credits,
				price: bundle.price,
				stripePriceId: bundle.stripePriceId,
				description: bundle.description
			}
		})
		console.log(`  ✓ ${bundle.name}`)
	}
}

async function main() {
	console.log('🌱 Seeding the database with subscription plans...')

	await seedPlans()
	await seedBundles()

	// await prisma.plan.upsert({
	// 	where: { name: 'FREE' },
	// 	update: {},
	// 	create: {
	// 		name: 'FREE',
	// 		monthlyPrice: 0,
	// 		annualPrice: 0,
	// 		trialDays: 0
	// 	}
	// })

	// // 2. PRO PLAN ($19/mo or $190/yr)
	// await prisma.plan.upsert({
	// 	where: { name: 'PRO' },
	// 	update: {},
	// 	create: {
	// 		name: 'PRO',
	// 		stripePriceId: 'price_1TVnftGly7U8J4pxoho8NzJZ',
	// 		stripePriceIdYear: 'price_1TVpbGGly7U8J4pxH1GIYjbZ',
	// 		monthlyPrice: 1000,
	// 		annualPrice: 9600,
	// 		trialDays: 1
	// 	}
	// })

	// await prisma.plan.upsert({
	// 	where: { name: 'ULTIMATE' },
	// 	update: {},
	// 	create: {
	// 		name: 'ULTIMATE',
	// 		stripePriceId: 'price_1TVnghGly7U8J4pxq4QcMvEM',
	// 		stripePriceIdYear: 'price_1TVpabGly7U8J4pxcST5sQkq',
	// 		monthlyPrice: 2500,
	// 		annualPrice: 24000,
	// 		trialDays: 1
	// 	}
	// })

	// await prisma.subscriptionPlan.createMany({
	// 	skipDuplicates: true,
	// 	data: [
	// 		{
	// 			name: 'Pro',
	// 			stripePriceMonthlyId: 'price_1TVnftGly7U8J4pxoho8NzJZ',
	// 			stripePriceAnnualId: 'price_1TVpbGGly7U8J4pxH1GIYjbZ',
	// 			monthlyCredits: 500,
	// 			annualCredits: 500,
	// 			sortOrder: 1
	// 		},
	// 		{
	// 			name: 'Ultimate',
	// 			stripePriceMonthlyId: 'price_1TVnghGly7U8J4pxq4QcMvEM',
	// 			stripePriceAnnualId: 'price_1TVpabGly7U8J4pxcST5sQkq',
	// 			monthlyCredits: 2000,
	// 			annualCredits: 2000,
	// 			sortOrder: 2
	// 		}
	// 	]
	// })

	console.log('✅ Seeding complete!')
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
