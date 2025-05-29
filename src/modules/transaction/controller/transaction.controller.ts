import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from "@nestjs/common";
import { ApiBody, ApiTags } from "@nestjs/swagger";
import { JwtGuard } from "../../auth/guard/jwt.guard";
import { TransactionService } from "../service/transaction.service";
import { CreateTransactionDto } from "../dto/transaction-create.dto";
import { UpdateTransactionDto } from "../dto/transaction-update.dto";

@ApiTags("Transaction")
@UseGuards(JwtGuard)
@Controller("api/transaction")
export class TransactionController{
    constructor(private transactionService: TransactionService){}

    @ApiBody({type:CreateTransactionDto})
    @Post()
    create(@Body() dto: CreateTransactionDto){
        return this.transactionService.create(dto);
    }

    @Get()
    getMany(@Query() query: Record<string,any>) {
        if(Object.keys(query).length >0){
            return this.transactionService.getBy(query);
        }
            return this.transactionService.getAll();
    }

    @Get(':id')
    get(@Param('id') transactionId: string){
        return this.transactionService.get(transactionId);
    }

    @ApiBody({type:UpdateTransactionDto})
    @Patch(':id')
    update(
        @Param('id') transactionId: string,
        @Body() dto: UpdateTransactionDto){
        return this.transactionService.update(transactionId, dto);
    }

    @Delete(':id')
    delete(@Param('id') transactionId: string){
        return this.transactionService.delete(transactionId);
    }
}