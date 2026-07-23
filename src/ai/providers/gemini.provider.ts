import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { generateText, streamText } from 'ai';
import {
    IAIProvider,
    AIGenerateOptions,
    AIMessage,
    AIResponse
} from "../interfaces/ai-provider.interface"

@Injectable()
export class GeminiProvider implements IAIProvider {
    private gemini;
    private model: string;

    constructor(private configService: ConfigService) {
        const apiKey = this.configService.get<string>('gemini.apiKey')
        this.model = this.configService.get<string>('gemini.model') || 'claude-sonet-4-6';

        if (!apiKey) {
            throw new Error('openAI API Key Not setting')
        }

        this.gemini = createGoogleGenerativeAI({
            apiKey,
        });
    }

    async generateText(
        messages: AIMessage[],
        options?: AIGenerateOptions,
    ): Promise<AIResponse> {
        const { text } = await generateText({
            model: this.gemini(this.model),
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
        console.log(messages)
        const { textStream } = streamText({
            model: this.gemini(this.model),
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