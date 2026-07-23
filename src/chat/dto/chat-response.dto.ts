export class ChatResponseDto {
    message: string;
    provider: string;
    model: string;
    timestamp: string;
    usage?: {
        promptTokens: number;
        completionTokens: number;
        totalTokens: number;
    }
}