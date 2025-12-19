import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  Query,
  ParseIntPipe,
  UseGuards,
  Request,
} from "@nestjs/common";
import { MurmursService } from "./murmurs.service";
import { CreateMurmurDto } from "./dto/create-murmur.dto";
import { MurmurResponseDto } from "./dto/murmur-response.dto";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { OptionalJwtAuthGuard } from "src/auth/optional-jwt-auth.guard";

@Controller("api/murmurs")
export class MurmursController {
  constructor(private readonly murmursService: MurmursService) {}

  @UseGuards(OptionalJwtAuthGuard)
  @Get()
  async findAll(
    @Query("page") page = 1,
    @Query("limit") limit = 10,
    @Request() req: any
  ) {
    const currentUserId = req.user?.id;
    return this.murmursService.findAll(currentUserId, +page, +limit);
  }

  @UseGuards(JwtAuthGuard)
  @Get("timeline")
  async getTimeline(
    @Query("page") page = 1,
    @Query("limit") limit = 10,
    @Request() req: any
  ) {
    return this.murmursService.findTimeline(req.user.id, +page, +limit);
  }

  @UseGuards(OptionalJwtAuthGuard)
  @Get(":id")
  async findOne(
    @Param("id", ParseIntPipe) id: number,
    @Request() req: any
  ): Promise<MurmurResponseDto> {
    const currentUserId = req.user?.id;
    return this.murmursService.findOne(id, currentUserId);
  }

  @UseGuards(OptionalJwtAuthGuard)
  @Get("user/:userId")
  async findByUser(
    @Param("userId", ParseIntPipe) userId: number,
    @Query("page") page = 1,
    @Query("limit") limit = 10,
    @Request() req: any
  ) {
    const currentUserId = req.user?.id;
    return this.murmursService.findByUser(userId, currentUserId, +page, +limit);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(
    @Body() createMurmurDto: CreateMurmurDto,
    @Request() req: any
  ): Promise<MurmurResponseDto> {
    return this.murmursService.create(req.user.id, createMurmurDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(":id")
  async delete(
    @Param("id", ParseIntPipe) id: number,
    @Request() req: any
  ): Promise<{ message: string }> {
    await this.murmursService.delete(id, req.user.id);
    return { message: "Murmur deleted successfully" };
  }

  @UseGuards(JwtAuthGuard)
  @Post(":id/like")
  async toggleLike(
    @Param("id", ParseIntPipe) id: number,
    @Request() req: any
  ): Promise<{ message: string }> {
    await this.murmursService.like(id, req.user.id);
    return { message: "Like toggled successfully" };
  }
}
