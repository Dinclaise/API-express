import { App } from "./app";
import { ErrorExceptionFilter } from "./errors/exception.filter";
import { LoggerService } from "./logger/logger.service";
import { UsersController } from "./users/users.controller";

async function bootstrap() {
  const logger = new LoggerService();
  const app = new App(
    logger,
    new UsersController(logger),
    new ErrorExceptionFilter(logger)
  );
  await app.init();
}

bootstrap();
