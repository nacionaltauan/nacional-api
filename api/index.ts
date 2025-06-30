import { NestFactory } from "@nestjs/core"
import { AppModule } from "../src/app.module"
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger"
import { ValidationPipe } from "@nestjs/common"
import { ExpressAdapter } from "@nestjs/platform-express"
import express from "express"
import * as swaggerUi from "swagger-ui-express" // Importar swagger-ui-express

// Cache da aplicação para reutilizar entre requests
let cachedApp: express.Express

async function createApp() {
  // Criar instância do Express
  const expressApp = express()
  const adapter = new ExpressAdapter(expressApp)

  const app = await NestFactory.create(AppModule, adapter)

  // Configurar CORS
  app.enableCors({
    origin: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })

  // Configurar Swagger
  const config = new DocumentBuilder()
    .setTitle("Google API Integration")
    .setDescription("API para integração com Google Drive e Sheets")
    .setVersion("1.0")
    .addTag("google-drive", "Operações do Google Drive")
    .addTag("google-sheets", "Operações do Google Sheets")
    .addTag("brasilseg", "Operações específicas do Brasilseg")
    .build()

  const document = SwaggerModule.createDocument(app, config)

  // Usar swagger-ui-express diretamente para servir a UI
  expressApp.use("/docs", swaggerUi.serve, swaggerUi.setup(document))

  // Configurar validação global
  app.useGlobalPipes(new ValidationPipe())

  await app.init()
  return expressApp
}

// Handler principal para Vercel
export default async function handler(req: any, res: any) {
  try {
    if (!cachedApp) {
      console.log("Inicializando aplicação NestJS...")
      cachedApp = await createApp()
      console.log("Aplicação inicializada com sucesso!")
    }

    return cachedApp(req, res)
  } catch (error) {
    console.error("Erro na função serverless:", error)
    res.status(500).json({
      error: "Internal Server Error",
      message: error.message,
      stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
    })
  }
}
