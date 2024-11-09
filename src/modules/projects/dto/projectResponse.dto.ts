import { IsNotEmpty, IsNumber, IsPositive, IsString } from "class-validator";

export class ProjectResponseDto {
  @IsNumber()
  @IsNotEmpty()
  id: number;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  goal: number;

  @IsNumber()
  @IsPositive()
  raised: number;


  constructor(data: any) {
    this.id = data._id?.toString();
    this.title = data.title;
    this.description = data.description;
    this.goal = data.goal;
    this.raised = data.raised;
  }
}
