import { Module } from "@nestjs/common";
import { ItemController } from "./controller/item.controller";
import { ItemService } from "./service/item.service";

@Module({
    controllers:[
        ItemController
    ],
    providers:[
        ItemService
    ]
})
export class ItemModule{}