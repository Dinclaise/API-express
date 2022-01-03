import { NextFunction, Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import { LoggerService } from './../logger/logger.service';
import { IExceptionFilter } from './exception.filter.interface';
import { HTTPError } from './http-error.class';
import { TYPES } from './../types';
import 'reflect-metadata';

@injectable()
export class ErrorExceptionFilter implements IExceptionFilter {
	constructor(@inject(TYPES.ILogger) private logger: LoggerService) {
		this.logger = logger;
	}

	catch(error: Error | HTTPError, req: Request, res: Response, next: NextFunction): void {
		if (error instanceof HTTPError) {
			this.logger.error(`[${error.context}] Ошибка ${error.statusCode}: ${error.message}`);
			res.status(error.statusCode).send({ error: error.message });
		} else {
			this.logger.error(`${error.message}`);
			res.status(500).send({ error: error.message });
		}
	}
}
