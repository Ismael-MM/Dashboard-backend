import { Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { JwTPayload } from '../interfaces/authenticated-request.interface';

const cookieExtractor = (req: Request): string | null => {
  if (req && req.cookies) {
    return req.cookies['access_token'] ?? null;
  }
  return null;
};

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private configService: ConfigService) {
    const secret = configService.get<string>('JWT_SECRET');

    if (!secret) {
      throw new Error('JWT_SECRET no está definido en las variables de entorno');
    }

    super({
      jwtFromRequest: cookieExtractor,
      ignoreExpiration: false,
      secretOrKey: secret,
    });
  }

  validate(payload: any) {
    return {
      id: payload.sub,
      username: payload.username,
      email: payload.email,
      nombre: payload.nombre,
      apellido: payload.apellido,
      roleId: payload.roleId,
      role: payload.role ?? null,
    };
  }
}
