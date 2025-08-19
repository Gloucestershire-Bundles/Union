import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class ErrorHandlingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(ErrorHandlingInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      catchError((error) => {
        const request = context.switchToHttp().getRequest();
        const response = context.switchToHttp().getResponse();

        // Log the error
        this.logger.error(
          `Error occurred in ${request.method} ${request.url}`,
          error.stack,
        );

        // Handle different types of errors
        if (error instanceof HttpException) {
          return throwError(() => error);
        }

        // Handle MongoDB duplicate key errors
        if (error.code === 11000) {
          const field = Object.keys(error.keyPattern || {})[0] || 'field';
          return throwError(
            () =>
              new HttpException(
                `${field} already exists`,
                HttpStatus.CONFLICT,
              ),
          );
        }

        // Handle MongoDB validation errors
        if (error.name === 'ValidationError') {
          const messages = Object.values(error.errors).map(
            (err: any) => err.message,
          );
          return throwError(
            () =>
              new HttpException(
                {
                  message: 'Validation failed',
                  errors: messages,
                },
                HttpStatus.BAD_REQUEST,
              ),
          );
        }

        // Handle MongoDB cast errors (invalid ObjectId, etc.)
        if (error.name === 'CastError') {
          return throwError(
            () =>
              new HttpException(
                `Invalid ${error.path}: ${error.value}`,
                HttpStatus.BAD_REQUEST,
              ),
          );
        }

        // Default to internal server error
        return throwError(
          () =>
            new HttpException(
              'Internal server error',
              HttpStatus.INTERNAL_SERVER_ERROR,
            ),
        );
      }),
    );
  }
}
