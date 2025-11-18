import { Controller, Get, Query, HttpException, HttpStatus } from "@nestjs/common"
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from "@nestjs/swagger"
import { GoogleService } from "../google/google.service"

@ApiTags("bbseg-guardachuva")
@Controller("bbseg-guardachuva")
export class BbsegGuardachuvaController {
  // IDs das planilhas principais
  private readonly SPREADSHEET_ID_ESTRATEGIA = "1tdFuCDyh1RDvhv9EGoZVJTBiHLSSOk-uUjp5rSbMUgg"
  private readonly SPREADSHEET_ID_GA4 = "1HOXNr49g68lQQo4fnh5nUi3mTynUionTq7t5m-u52m0"
  private readonly SPREADSHEET_ID_RECEPTIVOS = "1i1nW5ig7eG_6D8BdvxtEImKjdz7YVqBthU_WkUND8QM"

  constructor(private readonly googleService: GoogleService) {}

  @Get("estrategia-online")
  @ApiOperation({
    summary: "Buscar dados da Estratégia Online",
    description: "Retorna os dados da planilha de Estratégia Online - Resumo",
  })
  @ApiResponse({
    status: 200,
    description: "Dados da Estratégia Online retornados com sucesso",
  })
  async getEstrategiaOnline(@Query("range") range: string = "Resumo") {
    try {
      return await this.googleService.getSheetData(this.SPREADSHEET_ID_ESTRATEGIA, range)
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          error: "Erro ao buscar dados da Estratégia Online",
          message: error.message || "Erro desconhecido",
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      )
    }
  }

  @Get("estrategia-online/info")
  @ApiOperation({
    summary: "Informações da planilha de Estratégia Online",
    description: "Retorna informações gerais sobre a planilha de Estratégia Online",
  })
  @ApiResponse({
    status: 200,
    description: "Informações da planilha retornadas com sucesso",
  })
  async getEstrategiaOnlineInfo() {
    try {
      return await this.googleService.getSheetInfo(this.SPREADSHEET_ID_ESTRATEGIA)
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          error: "Erro ao buscar informações da planilha",
          message: error.message || "Erro desconhecido",
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      )
    }
  }

  @Get("consolidado")
  @ApiOperation({
    summary: "Buscar dados consolidados",
    description: "Retorna os dados consolidados da planilha de Estratégia Online",
  })
  @ApiQuery({ name: "range", required: false, description: "Range da planilha", example: "Consolidado" })
  @ApiResponse({
    status: 200,
    description: "Dados consolidados retornados com sucesso",
  })
  async getConsolidado(@Query("range") range: string = "Consolidado") {
    try {
      return await this.googleService.getSheetData(this.SPREADSHEET_ID_ESTRATEGIA, range)
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          error: "Erro ao buscar dados consolidados",
          message: error.message || "Erro desconhecido",
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      )
    }
  }

  @Get("tiktok")
  @ApiOperation({
    summary: "Buscar dados do TikTok",
    description: "Retorna os dados do TikTok da planilha de Estratégia Online",
  })
  @ApiQuery({ name: "range", required: false, description: "Range da planilha", example: "TikTok" })
  @ApiResponse({
    status: 200,
    description: "Dados do TikTok retornados com sucesso",
  })
  async getTikTok(@Query("range") range: string = "TikTok") {
    try {
      return await this.googleService.getSheetData(this.SPREADSHEET_ID_ESTRATEGIA, range)
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          error: "Erro ao buscar dados do TikTok",
          message: error.message || "Erro desconhecido",
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      )
    }
  }

  @Get("pinterest")
  @ApiOperation({
    summary: "Buscar dados do Pinterest",
    description: "Retorna os dados do Pinterest da planilha de Estratégia Online",
  })
  @ApiQuery({ name: "range", required: false, description: "Range da planilha", example: "Pinterest" })
  @ApiResponse({
    status: 200,
    description: "Dados do Pinterest retornados com sucesso",
  })
  async getPinterest(@Query("range") range: string = "Pinterest") {
    try {
      return await this.googleService.getSheetData(this.SPREADSHEET_ID_ESTRATEGIA, range)
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          error: "Erro ao buscar dados do Pinterest",
          message: error.message || "Erro desconhecido",
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      )
    }
  }

  @Get("meta-tratado")
  @ApiOperation({
    summary: "Buscar dados do Meta - Tratado",
    description: "Retorna os dados do Meta tratado da planilha de Estratégia Online",
  })
  @ApiQuery({ name: "range", required: false, description: "Range da planilha", example: "Meta - Tratado" })
  @ApiResponse({
    status: 200,
    description: "Dados do Meta tratado retornados com sucesso",
  })
  async getMetaTratado(@Query("range") range: string = "Meta - Tratado") {
    try {
      return await this.googleService.getSheetData(this.SPREADSHEET_ID_ESTRATEGIA, range)
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          error: "Erro ao buscar dados do Meta tratado",
          message: error.message || "Erro desconhecido",
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      )
    }
  }

  @Get("meta-nao-tratado")
  @ApiOperation({
    summary: "Buscar dados do Meta - Não Tratado",
    description: "Retorna os dados do Meta não tratado da planilha de Estratégia Online",
  })
  @ApiQuery({ name: "range", required: false, description: "Range da planilha", example: "Meta Não tratado" })
  @ApiResponse({
    status: 200,
    description: "Dados do Meta não tratado retornados com sucesso",
  })
  async getMetaNaoTratado(@Query("range") range: string = "Meta Não tratado") {
    try {
      return await this.googleService.getSheetData(this.SPREADSHEET_ID_ESTRATEGIA, range)
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          error: "Erro ao buscar dados do Meta não tratado",
          message: error.message || "Erro desconhecido",
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      )
    }
  }

  @Get("ga4/source")
  @ApiOperation({
    summary: "Buscar dados do GA4 Source",
    description: "Retorna os dados do GA4 Source",
  })
  @ApiQuery({ name: "range", required: false, description: "Range da planilha", example: "GA4 -Source" })
  @ApiResponse({
    status: 200,
    description: "Dados do GA4 Source retornados com sucesso",
  })
  async getGA4Source(@Query("range") range: string = "GA4 -Source") {
    try {
      return await this.googleService.getSheetData(this.SPREADSHEET_ID_GA4, range)
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          error: "Erro ao buscar dados do GA4 Source",
          message: error.message || "Erro desconhecido",
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      )
    }
  }

  @Get("ga4/completo")
  @ApiOperation({
    summary: "Buscar dados do GA4 Completo",
    description: "Retorna os dados do GA4 Completo",
  })
  @ApiQuery({ name: "range", required: false, description: "Range da planilha", example: "GA4 - Completo" })
  @ApiResponse({
    status: 200,
    description: "Dados do GA4 Completo retornados com sucesso",
  })
  async getGA4Completo(@Query("range") range: string = "GA4 - Completo") {
    try {
      return await this.googleService.getSheetData(this.SPREADSHEET_ID_GA4, range)
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          error: "Erro ao buscar dados do GA4 Completo",
          message: error.message || "Erro desconhecido",
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      )
    }
  }

  @Get("ga4/resumo")
  @ApiOperation({
    summary: "Buscar dados do GA4 Resumo",
    description: "Retorna os dados do GA4 Resumo",
  })
  @ApiQuery({ name: "range", required: false, description: "Range da planilha", example: "GA4 -Resumo" })
  @ApiResponse({
    status: 200,
    description: "Dados do GA4 Resumo retornados com sucesso",
  })
  async getGA4Resumo(@Query("range") range: string = "GA4 -Resumo") {
    try {
      return await this.googleService.getSheetData(this.SPREADSHEET_ID_GA4, range)
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          error: "Erro ao buscar dados do GA4 Resumo",
          message: error.message || "Erro desconhecido",
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      )
    }
  }

  @Get("ga4/info")
  @ApiOperation({
    summary: "Informações da planilha GA4",
    description: "Retorna informações gerais sobre a planilha GA4",
  })
  @ApiResponse({
    status: 200,
    description: "Informações da planilha retornadas com sucesso",
  })
  async getGA4Info() {
    try {
      return await this.googleService.getSheetInfo(this.SPREADSHEET_ID_GA4)
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          error: "Erro ao buscar informações da planilha",
          message: error.message || "Erro desconhecido",
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      )
    }
  }

  @Get("receptivos/ga4")
  @ApiOperation({
    summary: "Buscar dados do GA4 Receptivos",
    description: "Retorna os dados do GA4 Receptivos",
  })
  @ApiQuery({ name: "range", required: false, description: "Range da planilha", example: "GA4_receptivos" })
  @ApiResponse({
    status: 200,
    description: "Dados do GA4 Receptivos retornados com sucesso",
  })
  async getGA4Receptivos(@Query("range") range: string = "GA4_receptivos") {
    try {
      return await this.googleService.getSheetData(this.SPREADSHEET_ID_RECEPTIVOS, range)
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          error: "Erro ao buscar dados do GA4 Receptivos",
          message: error.message || "Erro desconhecido",
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      )
    }
  }

  @Get("receptivos/eventos")
  @ApiOperation({
    summary: "Buscar dados de Eventos Receptivos",
    description: "Retorna os dados de Eventos Receptivos",
  })
  @ApiQuery({ name: "range", required: false, description: "Range da planilha", example: "Eventos Receptivos" })
  @ApiResponse({
    status: 200,
    description: "Dados de Eventos Receptivos retornados com sucesso",
  })
  async getEventosReceptivos(@Query("range") range: string = "Eventos Receptivos") {
    try {
      return await this.googleService.getSheetData(this.SPREADSHEET_ID_RECEPTIVOS, range)
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          error: "Erro ao buscar dados de Eventos Receptivos",
          message: error.message || "Erro desconhecido",
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      )
    }
  }

  @Get("receptivos/info")
  @ApiOperation({
    summary: "Informações da planilha de Receptivos",
    description: "Retorna informações gerais sobre a planilha de Receptivos",
  })
  @ApiResponse({
    status: 200,
    description: "Informações da planilha retornadas com sucesso",
  })
  async getReceptivosInfo() {
    try {
      return await this.googleService.getSheetInfo(this.SPREADSHEET_ID_RECEPTIVOS)
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          error: "Erro ao buscar informações da planilha",
          message: error.message || "Erro desconhecido",
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      )
    }
  }
}

