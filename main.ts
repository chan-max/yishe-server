import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import * as express from 'express';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './src/app.module';
import { HttpExceptionFilter } from './src/core/filter/http-exception/http-exception.filter';
import { TransformInterceptor } from './src/core/interceptor/transform/transform.interceptor';
import { AllExceptionsFilter } from './src/core/filter/any-exception/any-exception.filter';
import { LoggerMiddleware } from './src/middleware/logger/logger.middleware';
import { HeaderMiddleware } from './src/middleware/header.middleware'
import { EncryptionMiddleware } from './src/middleware/encryption.middleware'

import crypto from 'crypto';

import * as path from 'path';
import * as fs from 'fs'
import * as bodyParser from 'body-parser';

// 环境配置信息
import envConfig from './config';
import { KeyService } from 'src/utils/key.service';

async function bootstrap() {
  const options: any = {
    json: { limit: '50mb' },
    urlencoded: { limit: '50mb', extended: true },
  }


  // 证书
  if (envConfig.https) {
    const keyFile = fs.readFileSync(path.join(__dirname + '/cert/1s.design.key'));
    const certFile = fs.readFileSync(path.join(__dirname + '/cert/1s.design.crt'));
    options.httpsOptions = {
      key: keyFile,
      cert: certFile,
    }
  }



  const app = await NestFactory.create(AppModule, options);


  app.enableCors({
    origin: "*",
    allowedHeaders: ['Authorization', 'content-type'],
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  })

  // 设置全局路由前缀
  app.setGlobalPrefix('api');

  app.use(express.static(path.join(__dirname, '..', 'public')));

  // 使用全局拦截器
  app.useGlobalInterceptors(new TransformInterceptor());
  // 使用全局过滤器
  app.useGlobalFilters(new AllExceptionsFilter());
  app.useGlobalFilters(new HttpExceptionFilter());
  // 使用全局管道
  app.useGlobalPipes(new ValidationPipe());
  app.use(express.json()); // For parsing application/json
  app.use(express.urlencoded({ extended: true })); // For parsing application/x-www-form-urlencoded
  // 使用中间件; 监听所有的请求路由，并打印日志
  app.use(new LoggerMiddleware().use);

  app.use(new HeaderMiddleware().use)


  app.use(new EncryptionMiddleware(app.get(KeyService)).use)

  // swagger配置
  const config = new DocumentBuilder()
    .setTitle('管理后台')
    .setDescription('管理后台接口文档')
    .setVersion('V1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  await app.listen(7788);
}
bootstrap();
