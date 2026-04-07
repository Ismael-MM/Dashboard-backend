import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import cookieParser from 'cookie-parser';
import { config as configcustom } from 'src/config';
import { PrismaClientExceptionFilter } from './common/filters/prisma-exception.filter';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  const frontendUrl = configService.get<string>('FRONTEND_URL');

  app.use(helmet());

  app.enableCors({
    origin: [frontendUrl, ...configcustom.cors.origin].filter(
      Boolean,
    ) as string[],
    credentials: configcustom.cors.credentials,
    methods: configcustom.cors.methods,
    allowedHeaders: configcustom.cors.allowedHeaders,
  });

  app.use(cookieParser());

  app.useGlobalFilters(new PrismaClientExceptionFilter());

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // elimina propiedades no declaradas en el DTO
      forbidNonWhitelisted: true, // lanza error si llegan propiedades extra
      transform: true,
      disableErrorMessages: process.env.NODE_ENV === 'production',
    }),
  );

  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  if (process.env.NODE_ENV !== 'production') {
    const config = new DocumentBuilder()
      .setTitle('Cats example')
      .setDescription('The cats API description')
      .setVersion('1.0')
      .addCookieAuth('access_token')
      .build();
    const documentFactory = () => SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, documentFactory);
  }

  const port = configService.get<number>('PORT') || 3000;

  await app.listen(port);
}
void bootstrap();
