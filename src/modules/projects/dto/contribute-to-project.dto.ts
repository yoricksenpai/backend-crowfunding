import { IsNotEmpty, IsNumber, IsPositive } from "class-validator";


export class ContributeToProjectDto {
    @IsNumber()
    @IsPositive()
    @IsNotEmpty()
    raised: number;
  }
  