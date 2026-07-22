import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express'
import { join } from 'node:path'
import * as nunjucks from 'nunjucks'


async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule)

  // nunjucks setting
  const viewsPath = join(__dirname, '..', 'views');

  nunjucks.configure(viewsPath, {
    watch: true,
    express: app.getHttpAdapter().getInstance(),
  });

  app.setBaseViewsDir(viewsPath);
  app.setViewEngine('html');

  // static file path setting
  app.useStaticAssets(join(__dirname, '..', 'public'));

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
