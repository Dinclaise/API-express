import { Container, ContainerModule, interfaces } from 'inversify';
import { App } from './app';
import { ErrorExceptionFilter } from './errors/exception.filter';
import { LoggerService } from './logger/logger.service';
import { UsersController } from './users/users.controller';
import { ILogger } from './logger/logger.interface';
import { TYPES } from './types';
import { IExceptionFilter } from './errors/exception.filter.interface';

const appBindings = new ContainerModule((bind: interfaces.Bind) => {
	bind<ILogger>(TYPES.ILogger).to(LoggerService);
	bind<IExceptionFilter>(TYPES.ErrorExceptionFilter).to(ErrorExceptionFilter);
	bind<UsersController>(TYPES.UserController).to(UsersController);
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
