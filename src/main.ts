import { NestFactory } from "@nestjs/core"
import { AppModule } from "./app.module"
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger"
import { ValidationPipe } from "@nestjs/common"

// Apenas para desenvolvimento local
async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  // Configurar CORS
  app.enableCors()

  // Configurar validação global
  app.useGlobalPipes(new ValidationPipe())

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

  const port = process.env.PORT || 4000
  await app.listen(port)
  console.log(`🚀 API rodando em: http://localhost:${port}`)
  console.log(`📚 Swagger em: http://localhost:${port}/api/docs`)
}

// Executar apenas se for chamado diretamente (desenvolvimento local)
if (require.main === module) {
  bootstrap()
}
