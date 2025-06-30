import { Controller, Get } from "@nestjs/common"
import { ApiTags, ApiOperation, ApiResponse } from "@nestjs/swagger"
import { GoogleService } from "../google/google.service" // Alterado de 'import type' para 'import'

@ApiTags("brasilseg")
@Controller("brasilseg")
export class BrasilsegController {
  private readonly SPREADSHEET_ID = "1I__xUMfEdx-T2KAhqpyq2L0yYKqASvpQe_kLBK161fg"
  private readonly RANGE = "base"

  constructor(private readonly googleService: GoogleService) {}

  @Get("influencers")
  @ApiOperation({
    summary: "Buscar dados dos influencers",
    description: "Retorna os dados da planilha de influencers do Brasilseg",
  })
  @ApiResponse({
    status: 200,
    description: "Dados dos influencers retornados com sucesso",
    schema: {
      type: "object",
      properties: {
        success: { type: "boolean" },
        data: {
          type: "object",
          properties: {
            range: { type: "string" },
            majorDimension: { type: "string" },
            values: {
              type: "array",
              items: {
                type: "array",
                items: { type: "string" },
              },
            },
            totalRows: { type: "number" },
            totalColumns: { type: "number" },
          },
        },
      },
    },
  })
  async getInfluencers() {
    try {
      return await this.googleService.getSheetData(this.SPREADSHEET_ID, this.RANGE)
    } catch (error) {
      throw new Error(`Erro ao buscar dados dos influencers: ${error.message}`)
    }
  }

  @Get("influencers/info")
  @ApiOperation({
    summary: "Informações da planilha de influencers",
    description: "Retorna informações gerais sobre a planilha de influencers",
  })
  @ApiResponse({
    status: 200,
    description: "Informações da planilha retornadas com sucesso",
  })
  async getInfluencersInfo() {
    try {
      return await this.googleService.getSheetInfo(this.SPREADSHEET_ID)
    } catch (error) {
      throw new Error(`Erro ao buscar informações da planilha: ${error.message}`)
    }
  }
}
