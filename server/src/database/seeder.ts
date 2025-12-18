import { DataSource } from "typeorm";
import { User } from "../entities/user.entity";
import { Murmur } from "../entities/murmur.entity";
import { Follow } from "../entities/follow.entity";
import { Like } from "../entities/like.entity";
import * as bcrypt from "bcrypt";

export async function seedDatabase(dataSource: DataSource) {
  const userRepository = dataSource.getRepository(User);
  const murmurRepository = dataSource.getRepository(Murmur);
  const followRepository = dataSource.getRepository(Follow);
  const likeRepository = dataSource.getRepository(Like);

  // Clear existing data in correct order (child tables first)
  await dataSource.query("SET FOREIGN_KEY_CHECKS = 0");
  await likeRepository.clear();
  await followRepository.clear();
  await murmurRepository.clear();
  await userRepository.clear();
  await dataSource.query("SET FOREIGN_KEY_CHECKS = 1");

  // Create users
  const hashedPassword = await bcrypt.hash("password123", 10);

  const users = await userRepository.save([
    {
      username: "johndoe",
      name: "John Doe",
      password: hashedPassword,
    },
    {
      username: "janesmith",
      name: "Jane Smith",
      password: hashedPassword,
    },
    {
      username: "bobjohnson",
      name: "Bob Johnson",
      password: hashedPassword,
    },
  ]);

  // Create follows
  await followRepository.save([
    { followerId: users[0].id, followingId: users[1].id }, // John follows Jane
    { followerId: users[0].id, followingId: users[2].id }, // John follows Bob
    { followerId: users[1].id, followingId: users[0].id }, // Jane follows John
    { followerId: users[2].id, followingId: users[1].id }, // Bob follows Jane
  ]);

  // Create murmurs
  const murmurs = await murmurRepository.save([
    {
      userId: users[0].id,
      content: "Hello world! This is my first murmur.",
    },
    {
      userId: users[1].id,
      content: "Beautiful day today! ☀️",
    },
    {
      userId: users[2].id,
      content: "Working on some exciting projects!",
    },
    {
      userId: users[0].id,
      content: "Love this new social platform!",
    },
    {
      userId: users[1].id,
      content: "Just finished reading a great book 📚",
    },
  ]);

  // Create likes
  await likeRepository.save([
    { userId: users[1].id, murmurId: murmurs[0].id }, // Jane likes John's first murmur
    { userId: users[0].id, murmurId: murmurs[1].id }, // John likes Jane's murmur
    { userId: users[2].id, murmurId: murmurs[1].id }, // Bob likes Jane's murmur
    { userId: users[1].id, murmurId: murmurs[3].id }, // Jane likes John's second murmur
    { userId: users[2].id, murmurId: murmurs[3].id }, // Bob likes John's second murmur
    { userId: users[0].id, murmurId: murmurs[4].id }, // John likes Jane's book murmur
  ]);

  console.log("Database seeded successfully!");
}
