import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppService {
  constructor(private configService: ConfigService) { }

  getHello(): string {
    const port = this.configService.get<Number>('port');
    const model = this.configService.get<String>('app.defaultProvider')

    return `Port: ${port}, Model: ${model}`;
  }
}
