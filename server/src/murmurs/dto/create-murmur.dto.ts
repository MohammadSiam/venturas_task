import { IsString, IsNotEmpty, MaxLength } from "class-validator";

export class CreateMurmurDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(280)
  content!: string;
}
