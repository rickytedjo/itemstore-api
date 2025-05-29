import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsISO8601, IsOptional, IsUUID, ValidateNested } from "class-validator";
import { UpdateTransactionItemDto } from "./transactionitems-update.dto";
import { Type } from "class-transformer";

export class UpdateTransactionDto{
    @ApiPropertyOptional()
    @IsISO8601()
    @IsOptional()
    date: Date;

    @ApiPropertyOptional()
    @IsUUID()
    @IsOptional()
    user_id: string;

    // @ApiPropertyOptional()
    // @IsOptional()
    // @ValidateNested({each:true})
    // @Type(()=>UpdateTransactionItemDto)
    // items: UpdateTransactionItemDto[];
}