import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsEmail, IsNumber, IsOptional, IsString } from "class-validator";

export class UpdateItemDto{
    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    name:string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsNumber()
    price: number;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    dec:string;
}