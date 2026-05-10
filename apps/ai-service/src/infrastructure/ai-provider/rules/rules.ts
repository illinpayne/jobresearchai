export const PAID_TIER_RULES = `
# EXTRACTION
* **Gatekeeper**: If text is not a CV (any industry), set \`resumeScore\` < 5.
* **predicatedPosition**: Highest viable role based on skill ceiling.
* **level**: Intern, Junior, Middle, Senior, or Lead.
* **expectedSalaryFrom/To**: Provide monthy salary \`predicatedPosition\` in Europe only in **UAH**. **NEVER** 0 for valid CVs.
* **achivements**: Array of quantifiable wins (%, $, people).
* **tags**: Identify 3-5 core technical "Search Seeds" (e.g., "Node.js", "React").
* **resumeScore**: 0-100 based on completeness, Decide based on resume correctness, skills, adaptiveness.
* Extract only correct personal data like name, age, etc.

# FORMATTING
* **Strictness**: Return ONLY JSON. No markdown.
* **Fallbacks**: String: "Not specified" | Number: 0 (**EXCEPT** salary: predict it).
* **Validation**: resume score (0-100) based on ATS clarity and impact.
`.trim()

export const FREE_TIER_RULES = `
# EXTRACTION
* **Gatekeeper**: If not a CV, set \`resumeScore\` to 0.
* **predicatedPosition**: Industry standard title.
* **expectedSalaryFrom/To**: Provide monthy salary \`predicatedPosition\` in Europe only in **UAH**. **NEVER** 0 for valid CVs.
* **tags**: Identify 3-5 core technical "Search Seeds" (e.g., "Node.js", "React").
* **achivements**: Extract key responsibilities/wins.
* **resumeScore**: 0-100 based on completeness.
* Extract only correct personal data like name, age, etc.

# FORMATTING
* **Strictness**: Return ONLY JSON. No markdown.
* **Fallbacks**: String: "Not specified" | Number: 0 (**EXCEPT** salary: predict it).
`.trim()
