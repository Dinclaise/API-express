import { Container, ContainerModule, interfaces } from 'inversify';
import { App } from './app';
import { ErrorExceptionFilter } from './errors/exception.filter';
import { LoggerService } from './logger/logger.service';
import { UsersController } from './users/users.controller';
import { ILogger } from './logger/logger.interface';
import { TYPES } from './types';
import { IExceptionFilter } from './errors/exception.filter.interface';
import { IUsersController } from './users/users.interface';
import { IUsersService } from './users/service/users.service.interface';
import { UserService } from './users/service/users.service';

const appBindings = new ContainerModule((bind: interfaces.Bind) => {
	bind<ILogger>(TYPES.ILogger).to(LoggerService);
	bind<IExceptionFilter>(TYPES.ErrorExceptionFilter).to(ErrorExceptionFilter);
	bind<IUsersController>(TYPES.UserController).to(UsersController);
	bind<IUsersService>(TYPES.UserService).to(UserService);
	bind<App>(TYPES.Application).to(App);
});

export interface IBootstrapReturn {
	appContainer: Container;
	app: App;
}

const bootstrap = (): IBootstrapReturn => {
	const appContainer = new Container();
	appContainer.load(appBindings);

	const app = appContainer.get<App>(TYPES.Application);
	app.init();

	return { appContainer, app };
};

export const { app, appContainer } = bootstrap();
