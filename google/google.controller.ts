import { Controller, Get, Query, Param, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { GoogleService } from './google.service';
import { GetFolderFilesDto, GetSheetDataDto, GetFileDetailsDto } from './dto/google.dto';

@ApiTags('google-drive')
@Controller('google')
export class GoogleController {
  private readonly logger = new Logger(GoogleController.name);

  constructor(private readonly googleService: GoogleService) {}

  @Get('drive/folder/:folderId/files')
  @ApiOperation({ 
    summary: 'Listar arquivos de uma pasta',
    description: 'Retorna todos os arquivos de uma pasta específica do Google Drive'
  })
  @ApiParam({ name: 'folderId', description: 'ID da pasta no Google Drive' })
  @ApiResponse({ 
    status: 200, 
    description: 'Lista de arquivos retornada com sucesso',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean' },
        data: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              name: { type: 'string' },
              mimeType: { type: 'string' },
              size: { type: 'string' },
              createdTime: { type: 'string' },
              modifiedTime: { type: 'string' }
            }
          }
        },
        total: { type: 'number' }
      }
    }
  })
  async getFilesInFolder(@Param('folderId') folderId: string) {
    try {
      return await this.googleService.listFilesInFolder(folderId);
    } catch (error) {
      this.logger.error(`Erro ao listar arquivos da pasta ${folderId}:`, error);
      throw new HttpException(
        {
          success: false,
          error: 'Erro ao acessar pasta',
          message: error.message || 'Erro desconhecido',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('drive/file/:fileId')
  @ApiOperation({ 
    summary: 'Detalhes de um arquivo',
    description: 'Retorna informações detalhadas de um arquivo específico'
  })
  @ApiParam({ name: 'fileId', description: 'ID do arquivo no Google Drive' })
  async getFileDetails(@Param('fileId') fileId: string) {
    try {
      return await this.googleService.getFileDetails(fileId);
    } catch (error) {
      this.logger.error(`Erro ao buscar detalhes do arquivo ${fileId}:`, error);
      throw new HttpException(
        {
          success: false,
          error: 'Erro ao acessar arquivo',
          message: error.message || 'Erro desconhecido',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('sheets/:spreadsheetId/data')
  @ApiOperation({ 
    summary: 'Buscar dados de uma planilha',
    description: 'Retorna os dados de uma planilha específica dentro de um range'
  })
  @ApiParam({ name: 'spreadsheetId', description: 'ID da planilha do Google Sheets' })
  @ApiQuery({ name: 'range', description: 'Range da planilha', required: false, example: 'A1:D10' })
  @ApiResponse({ 
    status: 200, 
    description: 'Dados da planilha retornados com sucesso'
  })
  @ApiResponse({
    status: 400,
    description: 'Requisição inválida',
  })
  @ApiResponse({
    status: 500,
    description: 'Erro interno do servidor',
  })
  async getSheetData(
    @Param('spreadsheetId') spreadsheetId: string,
    @Query('range') range: string = 'A1:Z1000'
  ) {
    try {
      this.logger.log(`Buscando dados da planilha ${spreadsheetId} com range ${range}`);
      const result = await this.googleService.getSheetData(spreadsheetId, range);
      return result;
    } catch (error) {
      this.logger.error(`Erro ao buscar dados da planilha ${spreadsheetId} (range: ${range}):`, error);
      
      // Determinar o status code apropriado baseado no tipo de erro
      let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
      let errorMessage = error.message || 'Erro desconhecido ao acessar planilha';
      
      // Se for erro de autenticação do Google
      if (error.message?.includes('authentication') || error.message?.includes('credentials')) {
        statusCode = HttpStatus.UNAUTHORIZED;
        errorMessage = 'Erro de autenticação com Google API. Verifique as credenciais.';
      }
      // Se for erro de permissão
      else if (error.message?.includes('permission') || error.message?.includes('403')) {
        statusCode = HttpStatus.FORBIDDEN;
        errorMessage = 'Sem permissão para acessar esta planilha.';
      }
      // Se a planilha não for encontrada
      else if (error.message?.includes('not found') || error.message?.includes('404')) {
        statusCode = HttpStatus.NOT_FOUND;
        errorMessage = 'Planilha não encontrada.';
      }
      
      throw new HttpException(
        {
          success: false,
          error: 'Erro ao acessar planilha',
          message: errorMessage,
          spreadsheetId,
          range,
        },
        statusCode,
      );
    }
  }

  @Get('sheets/:spreadsheetId/info')
  @ApiOperation({ 
    summary: 'Informações da planilha',
    description: 'Retorna informações gerais sobre a planilha e suas abas'
  })
  @ApiParam({ name: 'spreadsheetId', description: 'ID da planilha do Google Sheets' })
  async getSheetInfo(@Param('spreadsheetId') spreadsheetId: string) {
    try {
      return await this.googleService.getSheetInfo(spreadsheetId);
    } catch (error) {
      this.logger.error(`Erro ao buscar informações da planilha ${spreadsheetId}:`, error);
      throw new HttpException(
        {
          success: false,
          error: 'Erro ao acessar planilha',
          message: error.message || 'Erro desconhecido',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}