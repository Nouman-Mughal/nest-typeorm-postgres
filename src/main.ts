import { ValidationPipe } from '@nestjs/common';
// import { Logger } from 'nestjs-pino';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { TransformInterceptor } from './transfrom.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // app.useLogger(app.get(Logger));
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalInterceptors(new TransformInterceptor());
  await app.listen(3000);
}
bootstrap();
