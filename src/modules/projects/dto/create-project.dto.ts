import { IsNotEmpty, IsNumber, IsPositive, IsString } from "class-validator";


export class CreateProjectDto {
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
}
