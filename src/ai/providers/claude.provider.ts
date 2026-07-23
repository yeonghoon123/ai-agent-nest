import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createAnthropic } from '@ai-sdk/anthropic';
import { generateText, streamText } from 'ai';
import {
    IAIProvider,
    AIGenerateOptions,
    AIMessage,
    AIResponse
} from "../interfaces/ai-provider.interface"

@Injectable()
export class ClaudeProvider implements IAIProvider {
    private anthropic;
    private model: string;

    constructor(private configService: ConfigService) {
        const apiKey = this.configService.get<string>('anthropic.apiKey')
        this.model = this.configService.get<string>('anthropic.model') || 'claude-sonet-4-6';

        if (!apiKey) {
            throw new Error('anthropic API Key Not setting')
        }

        this.anthropic = createAnthropic({
            apiKey,
        });
    }

    async generateText(
        messages: AIMessage[],
        options?: AIGenerateOptions,
    ): Promise<AIResponse> {
        const { text } = await generateText({
            model: this.anthropic(this.model),
            messages: messages.map((msg) => ({
                role: msg.role,
                content: msg.content
            })),
            temperature: options?.temperature ?? 0.7
        })

        return {
            content: text,
            provider: 'claude',
            model: this.model,
        }
    };

    async *streamText(
        messages: AIMessage[],
        options?: AIGenerateOptions,
    ): AsyncIterable<string> {
        const { textStream } = streamText({
            model: this.anthropic(this.model),
            messages: messages.map((msg) => ({
                role: msg.role,
                content: msg.content
            })),
            temperature: options?.temperature ?? 0.7
        });

        for await (const chunk of textStream) {
            yield chunk;
        }
    };
}