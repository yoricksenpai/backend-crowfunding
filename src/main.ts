import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ValidationPipe } from '@nestjs/common';
import { useContainer } from 'class-validator';
import * as morgan from 'morgan';
import { config } from '../convict.config';
import { morganOptions } from '../winston.logger';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    bufferLogs: true,
  });

  // Get the Winston logger instance
  const logger = app.get(WINSTON_MODULE_NEST_PROVIDER);
  app.useLogger(logger);

  app.useGlobalPipes(
    new ValidationPipe({
      forbidNonWhitelisted: true,
      whitelist: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: false,
      }
    }),
  );

  app.setGlobalPrefix(config.get('basePath'));
  app.enableCors();

  const format = `\n\b:remote-addr - ':method :url HTTP/:http-version' :status :response-time ms - :res[content-length] ":referrer" ":user-agent"\n` + '\n\b';
  app.use(morgan(format, morganOptions));

  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  await app.listen(config.get('port'));
}
bootstrap();