import { Controller, Post, Get, UseGuards, Request } from '@nestjs/common';
import { AppService } from './app.service';
import { LocalAuthGuard } from './auth/guards/local-auth.guard';
import { AuthService } from './auth/auth.service';
import { Public } from './auth/decorators/public.decorator';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private authService: AuthService,
  ) {}

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('auth/login')
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  @Post('auth/logout')
  async logout(@Request() req) {
    return req.logout();
  }

  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }
}
