import { NestFactory } from "@nestjs/core";
import { ValidationPipe } from "@nestjs/common";
import { AppModule } from "./app.module";
import helmet from "helmet";
import * as cors from "cors";
import { DataSource } from "typeorm";
import { seedDatabase } from "./database/seeder";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    })
  );

  // Middleware setup
  app.use(helmet());
  app.use(
    cors({
      origin: "http://localhost:3000",
      credentials: true,
    })
  );

  // Seed database if needed
  const dataSource = app.get(DataSource);
  const shouldSeed = process.env.SEED_DATABASE === "true";

  if (shouldSeed) {
    await seedDatabase(dataSource);
  }

  await app.listen(3001);
  console.log("Server is running on http://localhost:3001");
}
bootstrap();
