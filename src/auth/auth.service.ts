import {
  Injectable,
  NotAcceptableException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { UsersRepository } from './users.repository';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './jwt-interface';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UsersRepository)
    private usersRepository: UsersRepository,
    private jwtservice: JwtService,
  ) {}
  async signUp(authcredentialsDto: AuthCredentialsDto): Promise<void> {
    return await this.usersRepository.createUser(authcredentialsDto);
  }
  async signIn(
    authcredentialsDto: AuthCredentialsDto,
  ): Promise<{ accessToken: string }> {
    try {
      const { username, password } = authcredentialsDto;
      const user = await this.usersRepository.findOneBy({
        username,
      });
      if (user && (await bcrypt.compare(password, user.password))) {
        const payload: JwtPayload = await { username };
        const accessToken = this.jwtservice.sign(payload);

        return { accessToken };
      } else {
        throw new UnauthorizedException('Please check your login credentials');
      }
    } catch {
      throw new NotAcceptableException('An unhandled error occurred');
    }
  }
}
