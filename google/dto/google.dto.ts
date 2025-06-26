import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class GetFolderFilesDto {
  @ApiProperty({
    description: 'ID da pasta no Google Drive',
    example: '1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms',
  })
  @IsString()
  @IsNotEmpty()
  folderId: string;
}

export class GetSheetDataDto {
  @ApiProperty({
    description: 'ID da planilha do Google Sheets',
    example: '1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms',
  })
  @IsString()
  @IsNotEmpty()
  spreadsheetId: string;

  @ApiProperty({
    description: 'Range da planilha (ex: A1:D10, Sheet1!A:D)',
    example: 'A1:D10',
    default: 'A1:Z1000',
  })
  @IsString()
  @IsOptional()
  range?: string = 'A1:Z1000';
}

export class GetFileDetailsDto {
  @ApiProperty({
    description: 'ID do arquivo no Google Drive',
    example: '1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms',
  })
  @IsString()
  @IsNotEmpty()
  fileId: string;
}