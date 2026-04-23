import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import { config } from 'config';
import { LocalUser } from './interfaces/authenticated-request.interface';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  //Este logea con el local passport
  async validateUser(identifier: string, pass: string): Promise<any> {
    const loginMethod = config.auth.loginMethod || 'email';

    const user = await this.usersService.findOneByIdentifier(loginMethod, identifier);



    if (user) {
      const isMatch = await bcrypt.compare(pass, user.password);

      if (isMatch) {
        const { password, ...result } = user as LocalUser;
        return result;
      } else {
        throw new UnauthorizedException(
          'La contraseña o el usuario no coinciden',
        );
      }
    } else {
      throw new UnauthorizedException(
        'La contraseña o el usuario no coinciden',
      );
    }
    return null;
  }

  // este logea la jwt
  login(user: any) {
    const payload = {
      username: user.username,
      email: user.email,
      sub: user.id,
      nombre: user.nombre,
      apellido: user.apellido,
      roleId: user.roleId,
    };
    return this.jwtService.sign(payload);
  }
}
