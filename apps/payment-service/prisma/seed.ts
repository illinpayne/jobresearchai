import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'

import { PrismaClient } from './generated/client'

const pool = new Pool({ connectionString: process.env.DATABASE_URL })
const adapter = new PrismaPg(pool)

const prisma = new PrismaClient({ adapter })

const PLANS = [
	{
		name: 'Basic',
		grantedCredits: 250,
		trialDays: 7,
		stripePriceMonthlyId: 'price_1TX6XKGly7U8J4pxBC5gLbAB',
		stripePriceAnnualId: 'price_1TX6XbGly7U8J4pxjDTYraBW'
	},
	{
		name: 'Pro',
		grantedCredits: 490,
		trialDays: 3,
		stripePriceMonthlyId: 'price_1TVnftGly7U8J4pxoho8NzJZ',
		stripePriceAnnualId: 'price_1TVpbGGly7U8J4pxH1GIYjbZ'
	},
	{
		name: 'Ultimate',
		grantedCredits: 1100,
		stripePriceMonthlyId: 'price_1TVnghGly7U8J4pxq4QcMvEM',
		stripePriceAnnualId: 'price_1TVpabGly7U8J4pxcST5sQkq'
	}
]

const BUNDLES = [
	{
		name: 'Quick reviewing',
		credits: 50,
		price: 2,
		stripePriceId: 'price_1TX2z8Gly7U8J4pxL1PZIxYL'
	},
	{
		name: 'Improve reviewing',
		credits: 120,
		price: 12,
		stripePriceId: 'price_1TX33TGly7U8J4pxuYHZE1kg'
	},
	{
		name: 'HR reviewing',
		credits: 290,
		price: 20,
		stripePriceId: 'price_1TX32BGly7U8J4pxIpxmcjM4'
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
				stripePriceAnnualId: plan.stripePriceAnnualId
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
				stripePriceId: bundle.stripePriceId
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
