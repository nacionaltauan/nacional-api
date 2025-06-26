import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Configurar CORS
  app.enableCors();
  
  // Configurar validação global
  app.useGlobalPipes(new ValidationPipe());
  
  // Configurar Swagger
  const config = new DocumentBuilder()
    .setTitle('Google API Integration')
    .setDescription('API para integração com Google Drive e Sheets')
    .setVersion('1.0')
    .addTag('google-drive', 'Operações do Google Drive')
    .addTag('google-sheets', 'Operações do Google Sheets')
    .build();
    
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);
  
  await app.listen(4000);
  console.log('🚀 API rodando em: http://localhost:4000');
  console.log('📚 Swagger em: http://localhost:4000/api/docs');
}
bootstrap();