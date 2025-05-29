import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsDecimal, IsISO8601, IsNotEmpty, IsOptional, IsUUID, Min, ValidateNested } from "class-validator";
import { CreateTransactionItemDto } from "./transactionitems-create.dto";

export class CreateTransactionDto{
    @ApiPropertyOptional()
    @IsISO8601()
    @IsOptional()
    date: Date;

    @ApiProperty()
    @IsUUID()
    @IsNotEmpty()
    user_id: string;

    // @ApiPropertyOptional()
    // @IsOptional()
    // @ValidateNested({each:true})
    // @Type(()=>CreateTransactionItemDto)
    // items: CreateTransactionItemDto[];
}