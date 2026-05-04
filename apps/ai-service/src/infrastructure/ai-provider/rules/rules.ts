export const PAID_TIER_LLM_RULE = `
# DATA EXTRACTION RULES
* **yearsOld**: If the age is not explicitly specified, use \`0\`.
* **predicatedPosition**: Predict the most accurate role based on the depth of their skill set, not just their latest title.
* **currentPosition**: Determine the current position of the candidate.
* **summary**: Provide a concise "tl;dr" of their professional profile.
* **achivements**: Extract a list of specific, quantifiable professional wins.
* * **expectedSalaryFrom/To**: Provide the most accurate salary in UAH currency based on the predicted position.
* **resumeScore**: Provide a score from 0 to 100 based on the candidate's skills, ATS compatibility and other factors.

# FORMATTING CONSTRAINTS
* **Strictness**: Return ONLY a JSON object. No markdown code blocks, no preamble.
* **Missing Data**: NEVER use \`null\` or \`undefined\`.
* **String Fallback**: For missing/empty strings, use the text: "Not specified".
* **Number Fallback**: For missing numbers, use \`0\`.
* **Validation**: Ensure all salary calculations are based on skills/achievements (the predicted role), not the historical current role.
`

export const FREE_TIER_LLM_RULE = `
# DATA EXTRACTION RULES
* **yearsOld**: If the age is not explicitly specified, use \`0\`.
* **predicatedPosition**: Predict the most accurate role based on the depth of their skill set, not just their latest title.
* **currentPosition**: Determine the current position of the candidate.
* **summary**: Provide a concise "tl;dr" of their professional profile.
* **achivements**: Extract a list of specific, quantifiable professional wins.
* * **expectedSalaryFrom/To**: Provide the most accurate salary in UAH currency based on the predicted position.
* **resumeScore**: Provide a score from 0 to 100 based on the candidate's skills, ATS compatibility and other factors.

# FORMATTING CONSTRAINTS
* **Strictness**: Return ONLY a JSON object. No markdown code blocks, no preamble.
* **Missing Data**: NEVER use \`null\` or \`undefined\`.
* **String Fallback**: For missing/empty strings, use the text: "Not specified".
* **Number Fallback**: For missing numbers, use \`0\`.
* **Validation**: Ensure all salary calculations are based on skills/achievements (the predicted role), not the historical current role.
`
