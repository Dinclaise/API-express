import { BaseController } from '../common/base.controller';
import { NextFunction, Response, Request } from 'express';
import { inject, injectable } from 'inversify';
import { ILogger } from './../logger/logger.interface';
import { TYPES } from '../types';
import 'reflect-metadata';
import { IUsersController } from './users.interface';

@injectable()
export class UsersController extends BaseController implements IUsersController {
	constructor(@inject(TYPES.ILogger) private loggerService: ILogger) {
		super(loggerService);
		this.bindRouter([
			{ path: '/register', method: 'post', func: this.register },
			{ path: '/login', method: 'post', func: this.login },
		]);
	}

	login(req: Request, res: Response, next: NextFunction): void {
		this.ok(res, 'login');
	}

	register(req: Request, res: Response, next: NextFunction): void {
		this.ok(res, 'register');
	}
}
