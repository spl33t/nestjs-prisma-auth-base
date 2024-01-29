import { BaseExceptionFilter, HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Catch, ArgumentsHost, HttpStatus } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { Response } from 'express';
import * as cookieParser from 'cookie-parser';

@Catch(Prisma.PrismaClientKnownRequestError, Prisma.PrismaClientValidationError,)
export class PrismaClientExceptionFilter extends BaseExceptionFilter {
  catch(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost) {
    console.error(exception.message);
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const message = exception.message.replace(/\n/g, '');
    console.log("PrismaClientExceptionFilter exception:", exception)
    switch (exception.code) {
      case 'P2002': {
        const status = HttpStatus.CONFLICT;
        response.status(status).json({
          statusCode: status,
          cause: `Prisma.${exception.meta?.modelName}: Unique constraint failed on the fields  ${(exception.meta?.target as string[]).join(",")}`,
          message: message,
        })
        break;
      }
      case 'P2025': {
        const status = HttpStatus.NOT_FOUND;
        response.status(status).json({
          statusCode: status,
          cause: exception.meta?.cause,
          message: message,
        })
        break;
      }
      default:
        // default 500 error code
        const status = HttpStatus.BAD_REQUEST;
        response.status(status).json({
          statusCode: status,
          message: message,
        });
        break;
    }
  }
}

const PORT = 4000

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors()
  app.use(cookieParser());
  const { httpAdapter } = app.get(HttpAdapterHost);
  app.useGlobalFilters(new PrismaClientExceptionFilter(httpAdapter));

  await app.listen(PORT, () => {
    console.log(`Server started on ${PORT}`)
  });
}
bootstrap();
