import {
    IsIn,
    IsNotEmpty,
    IsOptional,
    IsString,
    MaxLength
} from 'class-validator'

export class ChatMessageDto {
    @IsString()
    @IsNotEmpty()
    @MaxLength(2000)
    message: string;

    @IsString()
    @IsOptional()
    @IsIn(['openai', 'claude', 'gemini'])
    provider?: string;

    @IsString()
    @IsOptional()
    sessionId?: string;
}