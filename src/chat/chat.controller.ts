import {
    Post, Res, Body, Controller, Get, Delete, Param,
    HttpStatus, HttpException
} from '@nestjs/common';
import type { Response } from 'express';
import { ChatService } from './chat.service';
import { ConfigService } from '@nestjs/config';
import { AiService } from 'src/ai/ai.service';
import { ChatMessageDto } from './dto/chat-message.dto';

@Controller('api/chat')
export class ChatController {
    constructor(
        private chatService: ChatService,
        private configService: ConfigService,
        private aiService: AiService
    ) { }

    @Post('stream')
    async streamChat(
        @Body() chatMessageDto: ChatMessageDto,
        @Res() res: Response,
    ) {
        const sessionId = chatMessageDto.sessionId || this.chatService.generateSessionId();
        try {
            // SSE Header Setting
            res.setHeader('Content-type', 'text/event-stream');
            res.setHeader('Cache-Control', 'no-cache');
            res.setHeader('Connection', 'keep-alive');

            // Begin Streaming 
            const stream = this.chatService.chatStream(
                sessionId,
                chatMessageDto.message,
                chatMessageDto.provider,
            );

            for await (const chunk of stream) {
                res.write(`data: ${JSON.stringify({ chunk, sessionId })}\n\n`);
            }

            res.write(`data: ${JSON.stringify({ done: true, sessionId })}\n\n`);
            res.end();
        } catch (error) {
            if (error instanceof Error) {
                res.write(
                    `data: ${JSON.stringify({ error: error.message, sessionId })}\n\n`
                );
            } else {
                console.log("알 수 없는 에러 발생");
            }

            res.end();
        }
    }

    @Get('providers')
    getProviders() {
        const availableProviders = this.aiService.getAvailableProviders();
        const providerDisplayNames: Record<string, string> = {
            openai: 'GPT-5',
            claude: 'Claude',
            gemini: 'Gemini',
        }

        const providers = availableProviders.map((provider) => ({
            value: provider,
            label: providerDisplayNames[provider] || provider
        }));

        return {
            providers,
            default:
                this.configService.get<string>('app.defaultProvider') || 'openai'
        }
    }

    @Get('history/:sessionId')
    getHistory(@Param('sessionId') sessionId: string) {
        const messages = this.chatService.getSessionMessages(sessionId);
        return {
            sessionId,
            messages,
            count: messages.length
        }
    }

    @Delete('session/:sessionId')
    clearSession(@Param('sessionId') sessionId: string) {
        const success = this.chatService.clearSession(sessionId);

        if (!success) {
            throw new HttpException('Session Not Found', HttpStatus.NOT_FOUND)
        }

        return {
            message: 'Session cleared successfully',
            sessionId,
        }
    }
}


