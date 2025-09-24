import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ConfigService } from '@nestjs/config';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly configService: ConfigService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('debug')
  debug() {
    return {
      message: 'Debug endpoint',
      timestamp: new Date().toISOString(),
      environment: {
        NODE_ENV: process.env.NODE_ENV,
        PROJECT_ID: process.env.PROJECT_ID ? '✅ Definido' : '❌ Não definido',
        CLIENT_EMAIL: process.env.CLIENT_EMAIL ? '✅ Definido' : '❌ Não definido',
        PRIVATE_KEY: process.env.PRIVATE_KEY ? '✅ Definido' : '❌ Não definido',
        PRIVATE_KEY_LENGTH: process.env.PRIVATE_KEY?.length || 0,
        PRIVATE_KEY_STARTS_WITH: process.env.PRIVATE_KEY?.substring(0, 20) || 'N/A',
      },
    };
  }
}
