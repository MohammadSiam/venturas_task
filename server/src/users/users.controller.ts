import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  ParseIntPipe,
  UseGuards,
  Request,
} from "@nestjs/common";
import { UsersService } from "./users.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { UserResponseDto } from "./dto/user-response.dto";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";

@Controller("api/users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto): Promise<UserResponseDto> {
    return this.usersService.create(createUserDto);
  }

  @Get()
  async findAll(): Promise<UserResponseDto[]> {
    return this.usersService.findAll();
  }

  @Get(":id")
  async findOne(
    @Param("id", ParseIntPipe) id: number
  ): Promise<UserResponseDto> {
    return this.usersService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post(":id/follow")
  async follow(
    @Param("id", ParseIntPipe) id: number,
    @Request() req: any
  ): Promise<{ message: string }> {
    await this.usersService.follow(req.user.id, id);
    return { message: "Successfully followed user" };
  }

  @UseGuards(JwtAuthGuard)
  @Delete(":id/follow")
  async unfollow(
    @Param("id", ParseIntPipe) id: number,
    @Request() req: any
  ): Promise<{ message: string }> {
    await this.usersService.unfollow(req.user.id, id);
    return { message: "Successfully unfollowed user" };
  }

  @Get(":id/following")
  async getFollowing(
    @Param("id", ParseIntPipe) id: number
  ): Promise<UserResponseDto[]> {
    return this.usersService.getFollowing(id);
  }

  @Get(":id/followers")
  async getFollowers(
    @Param("id", ParseIntPipe) id: number
  ): Promise<UserResponseDto[]> {
    return this.usersService.getFollowers(id);
  }
}
