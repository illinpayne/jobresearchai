import { IPromptModel } from '@/infrastructure/ai-provider/models/prompt.model'

export abstract class AiProvider {
	public abstract waitablePrompt(prompt: IPromptModel)
	public abstract streamPrompt(prompt: IPromptModel)
}
