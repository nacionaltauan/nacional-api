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
  
  // Middleware CORS adicional para garantir funcionamento
  expressApp.use((req, res, next) => {
    const allowedOrigins = [
      "https://dashboard-itens-pessoais-black.vercel.app",
      "https://dashboard-itens-pessoais.vercel.app",
      "http://localhost:3000",
      "http://localhost:3001"
    ]
    
    const origin = req.headers.origin
    if (allowedOrigins.includes(origin as string)) {
      res.setHeader('Access-Control-Allow-Origin', origin as string)
    }
    
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept, Origin')
    res.setHeader('Access-Control-Allow-Credentials', 'true')
    
    if (req.method === 'OPTIONS') {
      res.status(200).end()
      return
    }
    
    next()
  })
  
  const adapter = new ExpressAdapter(expressApp)

  const app = await NestFactory.create(AppModule, adapter)

  // Configurar CORS
  app.enableCors({
    origin: [
      "https://dashboard-itens-pessoais-black.vercel.app",
      "https://dashboard-itens-pessoais.vercel.app",
      "http://localhost:3000",
      "http://localhost:3001"
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "Accept", "Origin"],
    credentials: true,
    optionsSuccessStatus: 200
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
