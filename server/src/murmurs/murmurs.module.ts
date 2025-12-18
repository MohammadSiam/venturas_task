import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { MurmursController } from "./murmurs.controller";
import { MurmursService } from "./murmurs.service";
import { Murmur } from "../entities/murmur.entity";
import { Like } from "../entities/like.entity";
import { Follow } from "../entities/follow.entity";
import { User } from "../entities/user.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Murmur, Like, Follow, User])],
  controllers: [MurmursController],
  providers: [MurmursService],
})
export class MurmursModule {}
