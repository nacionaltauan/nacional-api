import { NestFactory } from "@nestjs/core"
import { AppModule } from "../src/app.module"
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger"
import { ValidationPipe } from "@nestjs/common"
import { ExpressAdapter } from "@nestjs/platform-express"
import * as express from "express"

// Cache da aplicação para reutilizar entre requests
let cachedApp: express.Express

async function createApp() {
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
  SwaggerModule.setup("api/docs", app, document)

  // Configurar validação global
  app.useGlobalPipes(new ValidationPipe())

  await app.init()
  return expressApp
}

// Handler principal para Vercel
export default async function handler(req: any, res: any) {
  try {
    if (!cachedApp) {
      cachedApp = await createApp()
    }
    return cachedApp(req, res)
  } catch (error) {
    console.error("Error in serverless function:", error)
    res.status(500).json({
      error: "Internal Server Error",
      message: error.message,
    })
  }
}
