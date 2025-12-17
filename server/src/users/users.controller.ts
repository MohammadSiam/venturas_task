import { Controller, Get, Post, Param, UseGuards, Request, ParseIntPipe, Body } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getMe(@Request() req) {
    return this.usersService.getProfile(req.user.userId, req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getUser(@Request() req, @Param('id', ParseIntPipe) id: number) {
    return this.usersService.getProfile(req.user.userId, id);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/follow')
  async follow(@Request() req, @Param('id', ParseIntPipe) id: number) {
    await this.usersService.follow(req.user.userId, id);
    return { success: true };
  }
  
  @UseGuards(JwtAuthGuard)
  @Post(':id/unfollow')
  async unfollow(@Request() req, @Param('id', ParseIntPipe) id: number) {
    await this.usersService.unfollow(req.user.userId, id);
    return { success: true };
  }
}
