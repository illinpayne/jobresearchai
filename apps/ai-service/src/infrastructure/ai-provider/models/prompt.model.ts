export interface PromptModel {
	temperature: number
	maxTokens: number
	systemPrompt: string
	ownRule?: string
	paidTier: string
	llmName: string
	extractedText: string
}
