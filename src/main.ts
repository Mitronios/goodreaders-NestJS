import { NestFactory, Reflector } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { ThrottlerGuard } from '@nestjs/throttler';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: 'http://localhost:5173',
    credentials: true,
  });

  app.setGlobalPrefix('api/v1');

  // Enable validation globally
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const throttlerStorage = app.get('ThrottlerStorageService');
  const throttlerOptions = app.get('ThrottlerOptions');
  const reflector = app.get(Reflector);
  app.useGlobalGuards(new ThrottlerGuard(throttlerStorage, throttlerOptions, reflector));

  await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();
