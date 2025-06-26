import { Controller, Get, Query, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { GoogleService } from './google.service';
import { GetFolderFilesDto, GetSheetDataDto, GetFileDetailsDto } from './dto/google.dto';

@ApiTags('google-drive')
@Controller('google')
export class GoogleController {
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
    return this.googleService.listFilesInFolder(folderId);
  }

  @Get('drive/file/:fileId')
  @ApiOperation({ 
    summary: 'Detalhes de um arquivo',
    description: 'Retorna informações detalhadas de um arquivo específico'
  })
  @ApiParam({ name: 'fileId', description: 'ID do arquivo no Google Drive' })
  async getFileDetails(@Param('fileId') fileId: string) {
    return this.googleService.getFileDetails(fileId);
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
  async getSheetData(
    @Param('spreadsheetId') spreadsheetId: string,
    @Query('range') range: string = 'A1:Z1000'
  ) {
    return this.googleService.getSheetData(spreadsheetId, range);
  }

  @Get('sheets/:spreadsheetId/info')
  @ApiOperation({ 
    summary: 'Informações da planilha',
    description: 'Retorna informações gerais sobre a planilha e suas abas'
  })
  @ApiParam({ name: 'spreadsheetId', description: 'ID da planilha do Google Sheets' })
  async getSheetInfo(@Param('spreadsheetId') spreadsheetId: string) {
    return this.googleService.getSheetInfo(spreadsheetId);
  }
}