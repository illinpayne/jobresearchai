export const PAID_TIER_RULES = `
# EXTRACTION
* **Gatekeeper**: If text is not a CV (any industry), set \`resumeScore\` < 5.
* **predicatedPosition**: Highest viable role based on skill ceiling.
* **expectedSalaryFrom/To**: Predict annual **USD** market value for \`predicatedPosition\`. **NEVER** 0 for valid CVs. Convert to UAH.
* **achivements**: Array of quantifiable wins (%, $, people).
* **tags**: Functional domain clusters (e.g., "Leadership", "React", "Surgical").
* **level**: Intern, Junior, Middle, Senior, or Lead.
* * **resumeScore**: 0-100 based on completeness, Decide based on resume correctness, skills, adaptiveness.

# FORMATTING
* **Strictness**: Return ONLY JSON. No markdown (\`\`\`json), no preamble.
* **Fallbacks**: String: "Not specified" | Number: 0 (**EXCEPT** salary: predict it).
* **Validation**: resume score (0-100) based on ATS clarity and impact.
`.trim()

export const FREE_TIER_RULES = `
# EXTRACTION
* **Gatekeeper**: If not a CV, set \`resumeScore\` to 0.
* **predicatedPosition**: Industry standard title.
* **expectedSalaryFrom/To**: Predict annual **USD** market minimum. **DO NOT** use 0. Convert to UAH
* **achivements**: Extract key responsibilities/wins.
* **resumeScore**: 0-100 based on completeness.

# FORMATTING
* **Strictness**: Return ONLY JSON. No markdown.
* **Fallbacks**: String: "Not specified" | Number: 0 (**EXCEPT** salary: predict it).
`.trim()
