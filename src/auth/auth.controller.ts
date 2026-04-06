import {
  Body,
  Controller,
  Post,
  Get,
  Request,
  Res,
  UseGuards,
} from '@nestjs/common';
import * as e from 'express';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { Public } from './decorators/public.decorator';
import { AuthService } from './auth.service';
import { UsersService } from 'src/users/users.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { config } from 'src/config';
import type { AuthenticatedRequest } from './interfaces/authenticated-request.interface';
import ms from 'ms';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UsersService,
  ) {}

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('login')
  login(
    @Request() req: AuthenticatedRequest,
    @Res({ passthrough: true }) res: e.Response,
  ) {
    const token = this.authService.login(req.user);

    res.cookie('access_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax', // protección básica CSRF; 'strict' si frontend y backend comparten dominio
      maxAge: ms(config.auth.ExpiresIn),
    });

    const { password: _, ...user } = req.user;
    return { user };
  }

  @Public()
  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get('me')
  me(@Request() req: AuthenticatedRequest) {
    return { user: req.user };
  }

  @Post('logout')
  logout(@Res({ passthrough: true }) res: e.Response) {
    res.clearCookie('access_token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
    });
    return { message: 'Sesión cerrada correctamente' };
  }
}
