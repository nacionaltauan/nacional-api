import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { google } from 'googleapis';

@Injectable()
export class GoogleService {
  private readonly logger = new Logger(GoogleService.name);
  private auth;
  private drive;
  private sheets;
  private initialized = false;
  private initializationError: Error | null = null;

  constructor(private configService: ConfigService) {
    // Não inicializar no construtor - fazer lazy initialization
    // Isso evita que a aplicação falhe completamente se as credenciais não estiverem configuradas
  }

  private async ensureInitialized() {
    if (this.initialized) {
      return;
    }

    if (this.initializationError) {
      throw this.initializationError;
    }

    try {
      await this.initializeAuth();
      this.initialized = true;
    } catch (error) {
      this.initializationError = error;
      throw error;
    }
  }

  private async initializeAuth() {
    const clientEmail = this.configService.get('google.clientEmail');
    const privateKey = this.configService.get('google.privateKey');
    const projectId = this.configService.get('google.projectId');

    // Verificar se as credenciais estão configuradas
    if (!clientEmail || !privateKey) {
      const errorMessage = 'Credenciais do Google não configuradas. Configure CLIENT_EMAIL e PRIVATE_KEY nas variáveis de ambiente.';
      this.logger.error(errorMessage);
      throw new Error(errorMessage);
    }

    this.logger.log(`Inicializando Google APIs com cliente: ${clientEmail.substring(0, 10)}...`);
    
    try {
      this.auth = new google.auth.GoogleAuth({
        credentials: {
          client_email: clientEmail,
          private_key: privateKey,
          project_id: projectId,
        },
        scopes: [
          'https://www.googleapis.com/auth/drive.readonly',
          'https://www.googleapis.com/auth/spreadsheets.readonly',
        ],
      });

      // Testar a autenticação
      await this.auth.getClient();
      
      this.drive = google.drive({ version: 'v3', auth: this.auth });
      this.sheets = google.sheets({ version: 'v4', auth: this.auth });
      
      this.logger.log('Google APIs inicializadas com sucesso');
    } catch (error) {
      this.logger.error('Erro ao inicializar Google APIs:', {
        message: error.message,
        code: error.code,
      });
      throw new Error(`Erro ao inicializar Google APIs: ${error.message}`);
    }
  }

  // GOOGLE DRIVE METHODS
  async listFilesInFolder(folderId: string) {
    await this.ensureInitialized();
    
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
    await this.ensureInitialized();
    
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
    await this.ensureInitialized();

    try {
      this.logger.log(`Buscando dados: spreadsheetId=${spreadsheetId}, range=${range}`);
      
      const response = await this.sheets.spreadsheets.values.get({
        spreadsheetId,
        range,
      });

      const rows = response.data.values || [];
      
      this.logger.log(`Dados retornados: ${rows.length} linhas`);
      
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
      this.logger.error('Erro ao buscar dados da planilha:', {
        spreadsheetId,
        range,
        error: error.message,
        stack: error.stack,
        code: error.code,
        status: error.response?.status,
        statusText: error.response?.statusText,
      });
      
      // Extrair informações mais detalhadas do erro do Google
      let errorMessage = error.message || 'Erro desconhecido ao acessar planilha';
      
      // Se for um erro da API do Google, tentar extrair mais informações
      if (error.response?.data?.error) {
        const googleError = error.response.data.error;
        errorMessage = `${googleError.message || errorMessage} (Status: ${googleError.status || error.response.status})`;
        
        if (googleError.status === 'PERMISSION_DENIED') {
          errorMessage = 'Sem permissão para acessar esta planilha. Verifique se a conta de serviço tem acesso.';
        } else if (googleError.status === 'NOT_FOUND') {
          errorMessage = 'Planilha não encontrada. Verifique o ID da planilha.';
        } else if (googleError.status === 'INVALID_ARGUMENT') {
          errorMessage = `Argumento inválido: ${googleError.message || 'Verifique o range especificado'}`;
        }
      }
      
      throw new Error(`Erro ao acessar planilha: ${errorMessage}`);
    }
  }

  async getSheetInfo(spreadsheetId: string) {
    await this.ensureInitialized();
    
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