import type { AiModelResponse } from './ai.dto';

export const allModels: AiModelResponse[] = [
  {
    id: 'nano1',
    name: 'Junkie 4.5',
    description: 'Aggregates global job listings in real-time, filtering through millions of data points to find your exact niche match.',
    usage: 120,
    stars: 4,
    billing: 'Premium',
  },
  {
    id: 'nano2',
    name: 'Junkie Pro 1.0',
    description:
      'Deep-scans your technical stack to automatically refactor your profile for maximum ATS compatibility and recruiter visibility.',
    usage: 80,
    stars: 5,
    billing: 'Free',
  },
  {
    id: 'nano3',
    name: 'Junkie Talk 2.2',
    description: 'Simulates high-pressure technical interviews with real-time feedback on your architecture logic and soft skills',
    usage: 80,
    stars: 5,
    billing: 'Free',
  },
  {
    id: 'nano4',
    name: 'Junkie Value 3.1',
    description: 'Analyzes market trends and company funding to provide hyper-accurate salary benchmarks and negotiation leverage.',
    usage: 120,
    stars: 4,
    billing: 'Premium',
  },
  {
    id: 'nano5',
    name: 'Junkie Connect 5.0',
    description: 'Analyzes market trends and company funding to provide hyper-accurate salary benchmarks and negotiation leverage',
    usage: 80,
    stars: 3,
    billing: 'Premium',
  },
  {
    id: 'nano6',
    name: 'Junkie Script 1.4',
    description:
      'Generates high-conversion cover letters and project descriptions that highlight your unique contributions to production-ready code.',
    usage: 80,
    stars: 3,
    billing: 'Pro',
  },
  {
    id: 'nano7',
    name: 'Junkie Path 4.8',
    description:
      'Compares your current resume against trending job requirements to pinpoint the exact certifications or libraries you need next.',
    usage: 80,
    stars: 3,
    billing: 'Premium',
  },
  {
    id: 'nano8',
    name: 'Junkie Flow 2.0',
    description: 'An autonomous agent that manages your entire application pipeline, from initial submission to follow-up emails.',
    usage: 80,
    stars: 3,
    billing: 'Free',
  },
  {
    id: 'nano9',
    name: 'Junkie Nomad 3.5',
    description: 'Specialized in finding borderless roles with companies that offer full-remote infrastructure and asynchronous cultures.',
    usage: 80,
    stars: 3,
    billing: 'Pro',
  },
  {
    id: 'nano10',
    name: 'Junkie Seed 1.1',
    description: 'Scours early-stage funding rounds to find stealth-mode startups where you can have maximum impact and equity potential.',
    usage: 80,
    stars: 3,
    billing: 'Free',
  },
  {
    id: 'nano11',
    name: 'Junkie Stack 6.2',
    description:
      'Matches you with teams using your specific tech stack—like NestJS and Next.js—to ensure a seamless onboarding experience.',
    usage: 80,
    stars: 3,
    billing: 'Ultimate',
  },
  {
    id: 'nano12',
    name: 'Junkie Prime 9.0',
    description: `The ultimate career assistant: monitors the global market 24/7 and alerts you only when a "perfect-fit" role appears.`,
    usage: 80,
    stars: 3,
    billing: 'Ultimate',
  },
];

export const availableModels = allModels.filter((f) => f.billing === 'Free' || f.billing === 'Pro');
