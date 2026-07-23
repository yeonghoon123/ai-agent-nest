import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { withRetry } from 'src/utils/retry';
import { OpenAIProvider } from './providers/openai.provider';
import { GeminiProvider } from './providers/gemini.provider';
import { ClaudeProvider } from './providers/claude.provider';

import {
    IAIProvider,
    AIGenerateOptions,
    AIMessage,
    AIResponse
} from './interfaces/ai-provider.interface'

@Injectable()
export class AiService {
    private readonly logger = new Logger(AiService.name);
    private providers: Map<string, IAIProvider> = new Map();
    private defaultProvider: string;

    constructor(
        private ConfigService: ConfigService,
        private openAIProvider: OpenAIProvider,
        private claudeProvider: ClaudeProvider,
        private geminiProvider: GeminiProvider,

    ) {
        this.defaultProvider = this.ConfigService.get<string>('app.defaultProvider') || 'openai';

        // Provider 등록
        this.providers.set('openai', this.openAIProvider);
        this.providers.set('claude', this.claudeProvider);
        this.providers.set('gemini', this.geminiProvider);

    }

    async generateText(
        messages: AIMessage[],
        provider?: string,
        options?: AIGenerateOptions,
    ): Promise<AIResponse> {
        const selectedProvider = this.getProvider(provider);
        return selectedProvider.generateText(messages, options);
    }

    async *streamText(
        messages: AIMessage[],
        provider?: string,
        options?: AIGenerateOptions,
    ): AsyncIterable<string> {
        const selectedProvider = this.getProvider(provider);
        yield* selectedProvider.streamText(messages, options);
        return withRetry(
            () => selectedProvider.generateText(messages, options),
            {
                maxRetries: 3,
                initialDelayMs: 1000,
                maxDelayMs: 30000
            },
            this.logger,
        )
    }

    private getProvider(providerName?: string): IAIProvider {
        const name = providerName || this.defaultProvider;
        const provider = this.providers.get(name);

        if (!provider) {
            throw new Error(`AI Provider '${name}' None`)
        }

        return provider
    }

    getAvailableProviders(): string[] {
        return Array.from(this.providers.keys())
    }
}
