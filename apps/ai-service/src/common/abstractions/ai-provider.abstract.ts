import { PromptModel } from '@/infrastructure/ai-provider/models/prompt.model'
import { IProviderPromptResponse } from '@/infrastructure/ai-provider/responses/ai-provider.response'

export abstract class AiProvider {
	public abstract waitablePrompt(
		prompt: PromptModel
	): Promise<IProviderPromptResponse>
	public abstract streamPrompt(prompt: PromptModel)
}
