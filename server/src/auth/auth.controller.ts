import { Controller, Request, Post, UseGuards, Body, Get, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async login(@Body() req) {
      const user = await this.authService.validateUser(req.username, req.password);
      if (!user) {
          throw new UnauthorizedException('Invalid credentials');
      }
      return this.authService.login(user); // user object from validateUser
  }

  @Post('register')
  async register(@Body() req) {
    return this.authService.register(req.username, req.password);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }
}
