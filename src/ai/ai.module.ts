import { Module } from '@nestjs/common';
import { AiService } from './ai.service';
import { OpenAIProvider } from './providers/openai.provider';

@Module({
  providers: [AiService, OpenAIProvider]
})
export class AiModule { }
