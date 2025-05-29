import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsNumber, IsOptional, IsUUID, Min } from "class-validator";

export class UpdateTransactionItemDto{
    @ApiPropertyOptional()
    @IsOptional()
    @IsUUID()
    transaction_id:string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsUUID()
    item_id:string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsNumber()
    @Min(1, {message:"The minimal number is 1"})
    amount: number;
}