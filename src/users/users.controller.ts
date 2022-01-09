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
import { ValidateMiddleware } from './../common/validate.middleware';
import { sign } from 'jsonwebtoken';
import { IConfigService } from './../config/config.service.interface';
import { IUsersService } from './service/users.service.interface';

@injectable()
export class UsersController extends BaseController implements IUsersController {
	constructor(
		@inject(TYPES.ILogger) private loggerService: ILogger,
		@inject(TYPES.UserService) private usersService: IUsersService,
		@inject(TYPES.ConfigService) private configService: IConfigService,
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

		const jwt = await this.signJWT(req.body.email, this.configService.get('SECRET'));

		this.ok(res, { jwt });
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

	private signJWT(email: string, secret: string): Promise<string> {
		return new Promise((resolve, reject) => {
			sign(
				{
					email,
					iat: Math.floor(Date.now() / 1000),
				},
				secret,
				{
					algorithm: 'HS256',
				},
				(err, token) => {
					if (err) {
						reject();
					}

					resolve(token as string);
				},
			);
		});
	}
}
