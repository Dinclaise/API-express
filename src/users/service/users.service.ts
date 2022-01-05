import { injectable } from 'inversify';
import { UserRegisterDto } from '../dto/user-register.dto';
import { User } from '../entity/users.entity';
import { UserLoginDto } from './../dto/user-login.dto';
import { IUsersService } from './users.service.interface';

@injectable()
export class UserService implements IUsersService {
	async createUser({ email, name, password }: UserRegisterDto): Promise<User | null> {
		const newUser = new User(email, name);
		await newUser.setPassword(password);
		return null;
	}

	async validateUser(dto: UserLoginDto): Promise<boolean> {
		return true;
	}
}
