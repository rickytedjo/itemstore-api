import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsUUID, Min } from "class-validator";

export class CreateTransactionItemDto{
    @ApiProperty()
    @IsNotEmpty()
    @IsUUID()
    transaction_id:string;

    @ApiProperty()
    @IsNotEmpty()
    @IsUUID()
    item_id:string;

    @ApiProperty()
    @IsNotEmpty()
    @IsNumber()
    @Min(1, {message:"The minimal number is 1"})
    amount: number;
}