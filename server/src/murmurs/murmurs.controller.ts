import { Controller, Get, Post, Body, Param, Delete, UseGuards, Request, Query, ParseIntPipe } from '@nestjs/common';
import { MurmursService } from './murmurs.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('murmurs')
export class MurmursController {
  constructor(private readonly murmursService: MurmursService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Request() req, @Body() createMurmurDto: { content: string }) {
    return this.murmursService.create(req.user.userId, createMurmurDto.content);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(@Request() req, @Query('page') page: number = 1) {
    return this.murmursService.findTimeline(req.user.userId, page);
  }

  @UseGuards(JwtAuthGuard)
  @Get('user/:userId')
  findByUser(@Request() req, @Param('userId', ParseIntPipe) userId: number) {
      return this.murmursService.findByUserId(req.user.userId, userId);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Request() req, @Param('id', ParseIntPipe) id: number) {
    return this.murmursService.remove(req.user.userId, id);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/like')
  like(@Request() req, @Param('id', ParseIntPipe) id: number) {
      return this.murmursService.like(req.user.userId, id);
  }
}
