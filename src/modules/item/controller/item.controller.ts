import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from "@nestjs/common";
import { ApiBody, ApiTags } from "@nestjs/swagger";
import { JwtGuard } from "../../auth/guard/jwt.guard";
import { ItemService } from "../service/item.service";
import { CreateItemDto } from "../dto/item-create.dto";
import { UpdateItemDto } from "../dto/item-update.dto";

@ApiTags("Item")
@UseGuards(JwtGuard)
@Controller("api/item")
export class ItemController{
    constructor(private itemService: ItemService){}

    @ApiBody({type:CreateItemDto})
    @Post()
    create(@Body() dto: CreateItemDto){
        return this.itemService.create(dto);
    }

    @Get()
    getMany(@Query() query: Record<string,any>) {
        if(Object.keys(query).length >0){
            return this.itemService.getBy(query);
        }
            return this.itemService.getAll();
    }

    @Get(':id')
    get(@Param('id') itemId: string){
        return this.itemService.get(itemId);
    }

    @ApiBody({type:UpdateItemDto})
    @Patch(':id')
    update(
        @Param('id') itemId: string,
        @Body() dto: UpdateItemDto){
        return this.itemService.update(itemId, dto);
    }

    @Delete(':id')
    delete(@Param('id') itemId: string){
        return this.itemService.delete(itemId);
    }
}