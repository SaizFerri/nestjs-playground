import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = process.env.PORT || 3000;
  
  const options = new DocumentBuilder()
  .setTitle('Fly2log API Documentation')
  .setDescription('Fly2log developers API documentation.')
  .setVersion('1.0')
  .addTag('fly2log')
  .build();
  
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document);  

  app.enableCors();
  await app.listen(port);
}

bootstrap();
