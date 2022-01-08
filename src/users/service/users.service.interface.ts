import { User } from '../entity/users.entity';
import { UserLoginDto } from './../dto/user-login.dto';
import { UserRegisterDto } from './../dto/user-register.dto';
import { UserModel } from '@prisma/client';

export interface IUsersService {
	createUser: (dto: UserRegisterDto) => Promise<UserModel | null>;
	validateUser: (dto: UserLoginDto) => Promise<boolean>;
}
