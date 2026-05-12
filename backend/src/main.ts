import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as helmet from 'helmet';
import * as compression from 'compression';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT', 3001);
  
  app.enableCors();
  app.use(helmet());
  app.use(compression());
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    transform: true,
    forbidNonWhitelisted: true,
  }));
  
  app.setGlobalPrefix('api/v1');
  
  const swaggerConfig = new DocumentBuilder()
    .setTitle('MilestoneTrust API')
    .setDescription('Decentralized milestone payments for freelancers on Stellar')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api/docs', app, document);
  
  await app.listen(port);
  Logger.log(`🚀 MilestoneTrust Backend running on port ${port}`);
  Logger.log(`📚 API Docs: http://localhost:${port}/api/docs`);
}

bootstrap();