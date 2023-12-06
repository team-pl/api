import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  DocumentBuilder,
  SwaggerCustomOptions,
  SwaggerModule,
} from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import * as basicAuth from 'express-basic-auth';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Team+')
    .setDescription('Team+ API description')
    .setVersion('1.0')
    .addTag('')
    .build();

  const configService = app.get(ConfigService);

  // Swagger

  app.use(
    ['/docs', '/docs-json'],
    basicAuth({
      challenge: true,
      users: {
        [configService.get('swagger.user')]:
          configService.get('swagger.password'),
      },
    }),
  );

  const SwaggerCustomOption: SwaggerCustomOptions = {
    swaggerOptions: {
      persistAuthorization: true,
    },
  };

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document, SwaggerCustomOption);

  app.useGlobalPipes(new ValidationPipe());

  await app.listen(3000);
}
bootstrap();
