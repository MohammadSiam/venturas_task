import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  OneToMany,
} from "typeorm";
import { Murmur } from "./murmur.entity";
import { Like } from "./like.entity";
import { Follow } from "./follow.entity";

@Entity("users")
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true, length: 50 })
  username!: string;

  @Column({ length: 100 })
  name!: string;

  @Column({ select: false })
  password!: string;

  @CreateDateColumn({ name: "created_at" })
  createdAt!: Date;

  @OneToMany(() => Murmur, (murmur) => murmur.user)
  murmurs!: Murmur[];

  @OneToMany(() => Like, (like) => like.user)
  likes!: Like[];

  @OneToMany(() => Follow, (follow) => follow.follower)
  following!: Follow[];

  @OneToMany(() => Follow, (follow) => follow.following)
  followers!: Follow[];
}
