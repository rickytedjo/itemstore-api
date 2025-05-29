import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from "@nestjs/common";
import { ApiBody, ApiTags } from "@nestjs/swagger";
import { JwtGuard } from "../../auth/guard/jwt.guard";
import { TransactionItemService } from "../service/transactionitem.service";
import { CreateTransactionItemDto } from "../dto/transactionitems-create.dto";
import { UpdateTransactionItemDto } from "../dto/transactionitems-update.dto";

@ApiTags("TransactionItem")
@UseGuards(JwtGuard)
@Controller("api/transactionitem")
export class TransactionItemController{
    constructor(private transactionItemService: TransactionItemService){}

    @ApiBody({type:CreateTransactionItemDto})
    @Post()
    create(@Body() dto: CreateTransactionItemDto){
        return this.transactionItemService.create(dto);
    }

    @Get()
    getMany(@Query() query: Record<string,any>) {
        if(Object.keys(query).length >0){
            return this.transactionItemService.getBy(query);
        }
            return this.transactionItemService.getAll();
    }

    @Get(':id')
    get(@Param('id') transactionItemId: string){
        return this.transactionItemService.get(transactionItemId);
    }

    @ApiBody({type:UpdateTransactionItemDto})
    @Patch(':id')
    update(
        @Param('id') transactionItemId: string,
        @Body() dto: UpdateTransactionItemDto){
        return this.transactionItemService.update(transactionItemId, dto);
    }

    @Delete(':id')
    delete(@Param('id') transactionItemId: string){
        return this.transactionItemService.delete(transactionItemId);
    }
}