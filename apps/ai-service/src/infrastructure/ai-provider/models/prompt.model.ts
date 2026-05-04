export interface PromptModel {
	temperature: number
	maxTokens: number
	systemPrompt: string
	llmName: string
	paidTier: string
	extractedText: string
}
