import {
  Body,
  Controller,
  Post,
  Get,
  Request,
  Res,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import * as e from 'express';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { Public } from './decorators/public.decorator';
import { AuthService } from './auth.service';
import { UsersService } from 'src/users/users.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { config } from 'config';
import { CsrfService } from 'src/csrf/csrf.service';
import type {
  JwTAuthenticatedRequest,
  LocalAuthenticatedRequest,
} from './interfaces/authenticated-request.interface';
import ms from 'ms';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UsersService,
    private csrfService: CsrfService,
  ) {}

  @Throttle({ short: { limit: 3, ttl: 60000 } })
  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('login')
  login(
    @Request() req: LocalAuthenticatedRequest,
    @Res({ passthrough: true }) res: e.Response,
  ) {
    const token = this.authService.login(req.user);

    res.cookie('access_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: config.auth.cookieSameSite, // protección básica CSRF; 'strict' si frontend y backend comparten dominio
      maxAge: ms(config.auth.ExpiresIn),
    });

    const { password: _, ...user } = req.user;
    return { user };
  }

  @Throttle({ short: { limit: 3, ttl: 60000 } })
  @Public()
  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Public()
  @Throttle({ medium: { limit: 30, ttl: 60000 } })
  @Get('csrf-token')
  getCsrfToken(@Req() req: e.Request, @Res() res: e.Response) {
    const token = this.csrfService.generateToken(req, res);
    res.json({ token });
  }

  @Get('me')
  me(@CurrentUser() user: JwTAuthenticatedRequest) {
    return { user };
  }

  @Post('logout')
  logout(@Res({ passthrough: true }) res: e.Response) {
    res.clearCookie('access_token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: config.auth.cookieSameSite,
    });
    return { message: 'Sesión cerrada correctamente' };
  }
}
