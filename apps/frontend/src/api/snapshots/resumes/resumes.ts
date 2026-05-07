import type { ResumeResponse } from './resume.types';

export const allResumes: ResumeResponse[] = [
  {
    id: 'res_7721_abc',
    position: 'Lead DevOps Engineer',
    yearsOld: 34,
    location: 'Denver, CO',
    rating: 91,
    uploadedAt: new Date('2026-04-10T14:30:00Z'),
    usedAiModel: 'Junkie Talk 2.0',
    spentTokens: 90,
    specifications: [
      { key: 'Expertise', value: 'Cloud Native Architecture & Security' },
      { key: 'Tools', value: 'Kubernetes, Terraform, Azure, Prometheus' },
      {
        key: 'Accomplishment',
        value: 'Automated 100% of deployment pipelines for 50+ microservices',
      },
    ],
  },
  {
    id: 'res_8842_xyz',
    position: 'UX Researcher',
    yearsOld: 29,
    location: 'London, UK',
    rating: 84,
    uploadedAt: new Date('2026-04-15T09:15:00Z'),
    usedAiModel: 'Junkie Talk 2.0',
    spentTokens: 90,
    specifications: [
      {
        key: 'Methods',
        value: 'A/B Testing, Ethnographic Studies, Prototyping',
      },
      { key: 'Focus', value: 'Accessibility and Inclusive Design' },
      {
        key: 'Case Study',
        value: 'Increased mobile conversion rates by 22% via user flow overhaul',
      },
    ],
  },
  {
    id: 'res_1109_qrs',
    position: 'Financial Analyst',
    yearsOld: 26,
    location: 'Singapore',
    rating: 68,
    uploadedAt: new Date('2026-04-20T11:45:00Z'),
    usedAiModel: 'Junkie Talk 2.0',
    spentTokens: 90,
    specifications: [
      { key: 'Sector', value: 'FinTech / Emerging Markets' },
      { key: 'Skills', value: 'SQL, Tableau, Financial Modeling' },
      {
        key: 'Observation',
        value: 'Solid technical skills but lacks industry-specific storytelling',
      },
    ],
  },
];

export const recentResumes: ResumeResponse[] = [
  {
    id: 'eval_v1_001',
    position: 'Full Stack Developer',
    yearsOld: 30,
    location: 'Austin, TX',
    rating: 52,
    uploadedAt: new Date('2026-03-01T08:00:00Z'),
    usedAiModel: 'Junkie Talk 2.0',
    spentTokens: 90,
    specifications: [
      { key: 'Status', value: 'Initial Draft' },
      {
        key: 'Issues',
        value: 'Generic descriptions; weak impact metrics; poor formatting',
      },
      {
        key: 'Recommendation',
        value: 'Replace task lists with quantifiable achievements',
      },
    ],
  },
  {
    id: 'eval_v2_001',
    position: 'Full Stack Developer',
    yearsOld: 30,
    location: 'Austin, TX',
    rating: 96,
    uploadedAt: new Date('2026-04-22T16:20:00Z'),
    usedAiModel: 'Junkie Talk 2.0',
    spentTokens: 90,
    specifications: [
      { key: 'Status', value: 'AI Optimized / Final Version' },
      {
        key: 'Improvement',
        value: 'Integrated STAR method; highlighted Node.js and React efficiency gains',
      },
      { key: 'ATS Score', value: '98% match for targeted Senior roles' },
      {
        key: 'Result',
        value: '2x increase in recruiter response rate within 48 hours',
      },
    ],
  },
];
