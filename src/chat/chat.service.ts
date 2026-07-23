import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AiService } from 'src/ai/ai.service';
import { AIMessage } from 'src/ai/interfaces/ai-provider.interface';

export interface ChatSession {
    id: string;
    messages: AIMessage[];
    createdAt: Date;
    lastActivity: Date;
}

@Injectable()
export class ChatService {
    private sessions: Map<string, ChatSession> = new Map();
    private maxHistoryLength: number;

    constructor(
        private aiService: AiService,
        private configService: ConfigService
    ) {
        this.maxHistoryLength =
            this.configService.get<number>('app.maxHistoryLength') || 10;
    }

    getOrCreateSession(sessionId?: string): ChatSession {
        if (!sessionId) {
            sessionId = this.generateSessionId();
        }

        let session = this.sessions.get(sessionId);

        if (!session) {
            session = {
                id: sessionId,
                messages: [],
                createdAt: new Date(),
                lastActivity: new Date()
            };
            this.sessions.set(sessionId, session)
        }

        return session;
    }

    addMessage(sessionId: string, message: AIMessage): void {
        const session = this.getOrCreateSession(sessionId);
        session.messages.push(message);
        session.lastActivity = new Date();
        console.log(sessionId)

        // history max length
        if (session.messages.length > this.maxHistoryLength * 2) {
            session.messages = session.messages.slice(-this.maxHistoryLength * 2);
        }
    }

    getSessionMessages(sessionId: string): AIMessage[] {
        console.log(sessionId)

        const session = this.sessions.get(sessionId);

        return session ? [...session.messages] : [];
    }

    async *chatStream(
        sessionId: string,
        userMessage: string,
        provider?: string
    ): AsyncIterable<string> {
        // Add User Message
        const userMsg: AIMessage = {
            role: 'user',
            content: userMessage,
        };

        this.addMessage(sessionId, userMsg);

        // AI Response Streaming
        const messages = this.getSessionMessages(sessionId);
        let fullResponse = '';

        for await (const chunk of this.aiService.streamText(messages, provider)) {

            fullResponse += chunk;
            yield chunk;
        }

        // AI Response Save
        const assistantMsg: AIMessage = {
            role: 'assistant',
            content: fullResponse
        };

        this.addMessage(sessionId, assistantMsg);
    }

    generateSessionId(): string {
        return `session_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    }

    clearSession(sessionId: string): boolean {
        return this.sessions.delete(sessionId);
    }
}
