import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';
    let errorDetails: any = null;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();
      
      if (typeof exceptionResponse === 'string') {
        message = exceptionResponse;
      } else if (typeof exceptionResponse === 'object') {
        message = (exceptionResponse as any).message || message;
        errorDetails = exceptionResponse;
      }
    } else if (exception instanceof Error) {
      message = exception.message;
      
      // Log do erro completo para debug
      this.logger.error(
        `Unhandled exception: ${exception.message}`,
        exception.stack,
        `${request.method} ${request.url}`,
      );

      // Determinar status baseado na mensagem de erro
      if (message.includes('Credenciais') || message.includes('credentials')) {
        status = HttpStatus.UNAUTHORIZED;
      } else if (message.includes('permission') || message.includes('PERMISSION_DENIED')) {
        status = HttpStatus.FORBIDDEN;
      } else if (message.includes('not found') || message.includes('NOT_FOUND')) {
        status = HttpStatus.NOT_FOUND;
      } else if (message.includes('invalid') || message.includes('INVALID')) {
        status = HttpStatus.BAD_REQUEST;
      }
    }

    const errorResponse = {
      success: false,
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      message,
      ...(errorDetails && typeof errorDetails === 'object' ? errorDetails : {}),
    };

    this.logger.error(
      `Error ${status}: ${message}`,
      JSON.stringify(errorResponse, null, 2),
    );

    response.status(status).json(errorResponse);
  }
}

