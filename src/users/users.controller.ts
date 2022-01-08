import { BaseController } from '../common/base.controller';
import { NextFunction, Response, Request } from 'express';
import { inject, injectable } from 'inversify';
import { ILogger } from './../logger/logger.interface';
import { TYPES } from '../types';
import 'reflect-metadata';
import { IUsersController } from './users.interface';
import { UserLoginDto } from './dto/user-login.dto';
import { UserRegisterDto } from './dto/user-register.dto';
import { HTTPError } from './../errors/http-error.class';
import { UserService } from './service/users.service';
import { ValidateMiddleware } from './../common/validate.middleware';

@injectable()
export class UsersController extends BaseController implements IUsersController {
	constructor(
		@inject(TYPES.ILogger) private loggerService: ILogger,
		@inject(TYPES.UserService) private usersService: UserService,
	) {
		super(loggerService);
		this.bindRouter([
			{
				path: '/register',
				method: 'post',
				func: this.register,
				middlewares: [new ValidateMiddleware(UserRegisterDto)],
			},
			{
				path: '/login',
				method: 'post',
				func: this.login,
				middlewares: [new ValidateMiddleware(UserLoginDto)],
			},
		]);
	}

	async login(
		req: Request<{}, {}, UserLoginDto>,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		const result = await this.usersService.validateUser(req.body);

		if (!result) {
			return next(new HTTPError(401, 'Ошибка авторизации!', 'login'));
		}

		this.ok(res, {});
	}

	async register(
		{ body }: Request<{}, {}, UserRegisterDto>,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		const result = await this.usersService.createUser(body);

		if (!result) {
			return next(new HTTPError(422, 'Такой пользователь существует!'));
		}
		this.ok(res, { id: result.id, email: result.email });
	}
}
