import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
console.log('Starting application...');

async function bootstrap() {
  console.log('Starting application...');
  
  const app = await NestFactory.create(AppModule);
  console.log('Application created...');
  


  app.useGlobalPipes(new ValidationPipe());
  app.enableCors({
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    credentials: true,
  });

  const config = new DocumentBuilder()
    .setTitle('Discord Bot API')
    .setDescription(
      'API para el backend del bot de Discord con servicios de cumpleaños, OpenAI y más',
    )
    .setVersion('1.0')
    .addTag('discord')
    .addTag('birthdays')
    .addTag('openai')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'API Key',
        name: 'Authorization',
        description: 'Introduce tu API Key',
        in: 'header',
      },
      'API-KEY',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT') || 3000;

  await app.listen(port);
  console.log(`Application running on: http://localhost:${port}`);
  console.log(`Swagger documentation available at: http://localhost:${port}/api`);
}
bootstrap();
