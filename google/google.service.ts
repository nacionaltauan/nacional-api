import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { google } from 'googleapis';

@Injectable()
export class GoogleService {
  private readonly logger = new Logger(GoogleService.name);
  private auth;
  private drive;
  private sheets;

  constructor(private configService: ConfigService) {
    this.initializeAuth();
  }

  private initializeAuth() {
    try {
      this.auth = new google.auth.GoogleAuth({
        credentials: {
          client_email: this.configService.get('google.clientEmail'),
          private_key: this.configService.get('google.privateKey'),
        },
        scopes: [
          'https://www.googleapis.com/auth/drive.readonly',
          'https://www.googleapis.com/auth/spreadsheets.readonly',
        ],
      });

      this.drive = google.drive({ version: 'v3', auth: this.auth });
      this.sheets = google.sheets({ version: 'v4', auth: this.auth });
      
      this.logger.log('Google APIs inicializadas com sucesso');
    } catch (error) {
      this.logger.error('Erro ao inicializar Google APIs:', error);
      throw error;
    }
  }

  // GOOGLE DRIVE METHODS
  async listFilesInFolder(folderId: string) {
    try {
      const response = await this.drive.files.list({
        q: `'${folderId}' in parents and trashed=false`,
        fields: 'files(id, name, mimeType, size, createdTime, modifiedTime)',
        orderBy: 'name',
      });

      return {
        success: true,
        data: response.data.files,
        total: response.data.files?.length || 0,
      };
    } catch (error) {
      this.logger.error('Erro ao listar arquivos:', error);
      throw new Error(`Erro ao acessar pasta: ${error.message}`);
    }
  }

  async getFileDetails(fileId: string) {
    try {
      const response = await this.drive.files.get({
        fileId,
        fields: 'id, name, mimeType, size, createdTime, modifiedTime, parents, webViewLink',
      });

      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      this.logger.error('Erro ao buscar detalhes do arquivo:', error);
      throw new Error(`Erro ao acessar arquivo: ${error.message}`);
    }
  }

  // GOOGLE SHEETS METHODS
  async getSheetData(spreadsheetId: string, range: string) {
    try {
      const response = await this.sheets.spreadsheets.values.get({
        spreadsheetId,
        range,
      });

      const rows = response.data.values || [];
      
      return {
        success: true,
        data: {
          range: response.data.range,
          majorDimension: response.data.majorDimension,
          values: rows,
          totalRows: rows.length,
          totalColumns: rows[0]?.length || 0,
        },
      };
    } catch (error) {
      this.logger.error('Erro ao buscar dados da planilha:', error);
      throw new Error(`Erro ao acessar planilha: ${error.message}`);
    }
  }

  async getSheetInfo(spreadsheetId: string) {
    try {
      const response = await this.sheets.spreadsheets.get({
        spreadsheetId,
        fields: 'properties,sheets(properties)',
      });

      return {
        success: true,
        data: {
          title: response.data.properties?.title,
          sheets: response.data.sheets?.map(sheet => ({
            id: sheet.properties?.sheetId,
            title: sheet.properties?.title,
            index: sheet.properties?.index,
            rowCount: sheet.properties?.gridProperties?.rowCount,
            columnCount: sheet.properties?.gridProperties?.columnCount,
          })),
        },
      };
    } catch (error) {
      this.logger.error('Erro ao buscar informações da planilha:', error);
      throw new Error(`Erro ao acessar planilha: ${error.message}`);
    }
  }
}