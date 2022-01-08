import { IConfigService } from './config.service.interface';
import { config, DotenvConfigOutput, DotenvParseOutput } from 'dotenv';
import { inject } from 'inversify/lib/annotation/inject';
import { TYPES } from '../types';
import { ILogger } from '../logger/logger.interface';
import { injectable } from 'inversify';

@injectable()
export class ConfigService implements IConfigService {
	private config: DotenvParseOutput;

	constructor(@inject(TYPES.ILogger) private logger: ILogger) {
		const result: DotenvConfigOutput = config();

		if (result.error) {
			this.logger.error('[ConfigService] Не удалось прочитать файл .env или он отсутсвует.');
		} else {
			this.logger.log('[ConfigService] Конфиг .env загружен!');
			this.config = result.parsed as DotenvParseOutput;
		}
	}
	get(key: string): string {
		return this.config[key];
	}
}
