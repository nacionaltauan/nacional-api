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

  @Get('env-check')
  envCheck() {
    return {
      status: 'Environment variables check',
      variables: {
        PROJECT_ID: !!process.env.PROJECT_ID,
        CLIENT_EMAIL: !!process.env.CLIENT_EMAIL,
        PRIVATE_KEY: !!process.env.PRIVATE_KEY,
      }
    };
  }

  @Get('test-google-auth')
  async testGoogleAuth() {
    try {
      const { GoogleAuth } = require('google-auth-library');
      const auth = new GoogleAuth({
        credentials: {
          client_email: process.env.CLIENT_EMAIL,
          private_key: process.env.PRIVATE_KEY?.replace(/\\n/g, '\n'),
        },
        scopes: [
          'https://www.googleapis.com/auth/drive.readonly',
          'https://www.googleapis.com/auth/spreadsheets.readonly',
        ],
      });

      const authClient = await auth.getClient();
      return {
        status: 'success',
        message: 'Google Auth initialized successfully',
        clientEmail: process.env.CLIENT_EMAIL,
        privateKeyLength: process.env.PRIVATE_KEY?.length,
        privateKeyStartsWith: process.env.PRIVATE_KEY?.substring(0, 30),
      };
    } catch (error) {
      return {
        status: 'error',
        message: error.message,
        stack: error.stack,
        clientEmail: process.env.CLIENT_EMAIL,
        privateKeyLength: process.env.PRIVATE_KEY?.length,
        privateKeyStartsWith: process.env.PRIVATE_KEY?.substring(0, 30),
      };
    }
  }

  @Get('test-sheets-access')
  async testSheetsAccess() {
    try {
      const { GoogleAuth } = require('google-auth-library');
      const { google } = require('googleapis');
      
      const auth = new GoogleAuth({
        credentials: {
          client_email: process.env.CLIENT_EMAIL,
          private_key: process.env.PRIVATE_KEY?.replace(/\\n/g, '\n'),
        },
        scopes: [
          'https://www.googleapis.com/auth/drive.readonly',
          'https://www.googleapis.com/auth/spreadsheets.readonly',
        ],
      });

      const authClient = await auth.getClient();
      const sheets = google.sheets({ version: 'v4', auth: authClient });
      
      // Testar com uma planilha pública conhecida
      const response = await sheets.spreadsheets.get({
        spreadsheetId: '1eyj0PSNlZvvxnj9H0G0LM_jn2Ry4pSHACH2WwP7xUWw',
      });

      return {
        status: 'success',
        message: 'Sheets access working',
        spreadsheetTitle: response.data.properties?.title,
        spreadsheetId: response.data.spreadsheetId,
      };
    } catch (error) {
      return {
        status: 'error',
        message: error.message,
        errorCode: error.code,
        errorDetails: error.errors,
      };
    }
  }
}
