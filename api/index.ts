import { NestFactory } from "@nestjs/core"
import { AppModule } from "../src/app.module"
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger"
import { ValidationPipe } from "@nestjs/common"
import { ExpressAdapter } from "@nestjs/platform-express"
import express from "express"
import * as swaggerUi from "swagger-ui-express" // Importar swagger-ui-express
import { AllExceptionsFilter } from "../src/filters/http-exception.filter"

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
      "https://dashboard-ccbb-flight2.vercel.app",
      "https://dashboard-bbseg-campanha-guardachuv.vercel.app",
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
      "https://dashboard-ccbb-flight2.vercel.app",
      "https://dashboard-bbseg-campanha-guardachuv.vercel.app",
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
    .addTag("bbseg-guardachuva", "Operações específicas do BBSEG Guarda-chuva")
    .build()

  const document = SwaggerModule.createDocument(app, config)

  // Usar swagger-ui-express diretamente para servir a UI
  expressApp.use("/docs", swaggerUi.serve, swaggerUi.setup(document))

  // Configurar validação global
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    transform: true,
    forbidNonWhitelisted: false,
  }))

  // Configurar filtro de exceções global
  app.useGlobalFilters(new AllExceptionsFilter())

  await app.init()
  return expressApp
}

// Handler principal para Vercel
export default async function handler(req: any, res: any) {
  try {
    if (!cachedApp) {
      console.log("Inicializando aplicação NestJS...")
      try {
        cachedApp = await createApp()
        console.log("Aplicação inicializada com sucesso!")
      } catch (initError) {
        console.error("Erro ao inicializar aplicação:", initError)
        return res.status(500).json({
          success: false,
          statusCode: 500,
          message: "Erro ao inicializar aplicação",
          error: initError.message,
          timestamp: new Date().toISOString(),
        })
      }
    }

    // Deixar o NestJS tratar os erros através do ExceptionFilter
    return cachedApp(req, res)
  } catch (error) {
    // Este catch só deve capturar erros críticos de inicialização
    // Erros de rotas são tratados pelo AllExceptionsFilter
    console.error("Erro crítico na função serverless:", error)
    return res.status(500).json({
      success: false,
      statusCode: 500,
      message: "Erro crítico no servidor",
      error: error.message,
      timestamp: new Date().toISOString(),
    })
  }
}
