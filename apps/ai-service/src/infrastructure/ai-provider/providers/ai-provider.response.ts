export interface IProviderUsageTokens {
	promptTokens: number
	completionTokens: number
	totalTokens: number
}

export interface IProviderPromptResponse {
	usage: IProviderUsageTokens | null
	rawData: any | null
}
