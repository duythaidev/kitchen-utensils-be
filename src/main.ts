import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
// import * as cookieParser from 'cookie-parser';
import { useContainer } from 'class-validator';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // app.use(cookieParser());

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    transformOptions: { enableImplicitConversion: true },
  }));
  useContainer(app.select(AppModule), { fallbackOnErrors: true });
  app.enableCors({
    origin: [
      'http://localhost:3000',
      // 'http://example.com',
      // 'http://www.example.com',
      // 'http://app.example.com',
      // 'https://example.com',
      // 'https://www.example.com',
      // 'https://app.example.com',
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true,
  });

  app.setGlobalPrefix('api/v1');
  await app.listen(process.env.PORT ?? 8080);
}
bootstrap();
