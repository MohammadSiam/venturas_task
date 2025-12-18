import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { UsersService } from "../users/users.service";
import { LoginDto } from "./dto/login.dto";
import * as bcrypt from "bcrypt";

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService
  ) {}

  async login(
    loginDto: LoginDto
  ): Promise<{ access_token: string; user: any }> {
    const user = await this.usersService.findByUsername(loginDto.username);

    if (!user || !(await bcrypt.compare(loginDto.password, user.password))) {
      throw new UnauthorizedException("Invalid credentials");
    }

    const payload = { username: user.username, sub: user.id };
    const userResponse = await this.usersService.findOne(user.id);

    return {
      access_token: this.jwtService.sign(payload),
      user: userResponse,
    };
  }

  async validateUser(userId: number): Promise<any> {
    return this.usersService.findOne(userId);
  }
}
