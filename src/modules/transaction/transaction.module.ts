import { Module } from "@nestjs/common";
import { TransactionController } from "./controller/transaction.controller";
import { TransactionService } from "./service/transaction.service";
import { TransactionItemController } from "./controller/transactionitem.controller";
import { TransactionItemService } from "./service/transactionitem.service";

@Module({
    controllers:[
        TransactionController,
        TransactionItemController
    ],
    providers:[
        TransactionService,
        TransactionItemService
    ]
})
export class TransactionModule{}