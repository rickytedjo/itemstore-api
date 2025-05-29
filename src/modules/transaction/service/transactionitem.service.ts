import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../../prisma";
import { CreateTransactionItemDto } from "../dto/transactionitems-create.dto";
import { UpdateTransactionItemDto } from "../dto/transactionitems-update.dto";
import { Decimal } from "@prisma/client/runtime/library";


@Injectable()
export class TransactionItemService{
    constructor(
        private prisma: PrismaService
    ){}
    
        async create(dto: CreateTransactionItemDto){
            try{
                const temp : any = {...dto};

                const item = await this.prisma.item.findFirstOrThrow({where:{id:dto.item_id}});

                temp.subtotal = new Decimal(dto.amount).mul(item.price);
            
                const old = await this.prisma.transaction.findFirstOrThrow({where:{id:dto.transaction_id}});

                const data = await this.prisma.transactionItem.create({
                    data: temp
                })

                if(data){
                    const newTotal = new Decimal(old.total).plus(temp.subtotal);
                    await this.prisma.transaction.update({
                        data: { total: newTotal },
                        where: {id: old.id}
                    })
                }
    
                return{
                    statusCode: 201,
                    message: 'TransactionItem data created successfully',
                    data: data
                }
            }
            catch(error){
                return {
                    statusCode: error.code,
                    message: error.message
                }
            }
        }
        async get( transactionItemId: string){
            const data = await this.prisma.transactionItem.findFirst({where:{id:transactionItemId}});
    
            return data;
        }
        async getAll(){
            const data = await this.prisma.transactionItem.findMany();
            
            return data;
        }
        async getBy(filters: Record<string,any>){
            const where: Record<string, any> = {}
    
            for (const [key, value] of Object.entries(filters)) {
              where[key] = { equals: value };
            }
    
            return await this.prisma.transactionItem.findMany({ where });
        }
        async update(transactionItemId: string, dto: UpdateTransactionItemDto) {
          try {
            const oldItem = await this.prisma.transactionItem.findFirstOrThrow({
              where: { id: transactionItemId },
            });
        
            const oldItemData = await this.prisma.item.findFirstOrThrow({
              where: { id: oldItem.item_id },
            });
        
            const newItemData = dto.item_id
              ? await this.prisma.item.findFirstOrThrow({ where: { id: dto.item_id } })
              : oldItemData;
        
            const oldSubtotal = new Decimal(oldItem.amount).mul(oldItemData.price);
            const newAmount = dto.amount ?? oldItem.amount;
            const newSubtotal = new Decimal(newAmount).mul(newItemData.price);
        
            const updatedTransactionItem = await this.prisma.transactionItem.update({
              where: { id: transactionItemId },
              data: dto,
            });
        
            const oldTransaction = await this.prisma.transaction.findUniqueOrThrow({
              where: { id: oldItem.transaction_id },
            });
        
            const updatedOldTransactionTotal = new Decimal(oldTransaction.total)
              .sub(oldSubtotal);
        
            await this.prisma.transaction.update({
              where: { id: oldItem.transaction_id },
              data: { total: updatedOldTransactionTotal },
            });
        
            const newTransactionId = dto.transaction_id ?? oldItem.transaction_id;
        
            let newTransaction;
            if (newTransactionId === oldItem.transaction_id) {
              newTransaction = oldTransaction;
            } else {
              newTransaction = await this.prisma.transaction.findUniqueOrThrow({
                where: { id: newTransactionId },
              });
            }
        
            const updatedNewTransactionTotal = new Decimal(newTransaction.total)
              .add(newSubtotal);
        
            await this.prisma.transaction.update({
              where: { id: newTransactionId },
              data: { total: updatedNewTransactionTotal },
            });
        
            return {
              statusCode: 200,
              message: 'TransactionItem data updated successfully',
              data: updatedTransactionItem,
            };
          } catch (error) {
            return {
              statusCode: error.code || 500,
              message: error.message || 'Internal server error',
            };
          }
        }
        async delete(transactionItemId: string) {
          try {
            const itemToDelete = await this.prisma.transactionItem.findFirstOrThrow({
              where: { id: transactionItemId },
            });
            const itemData = await this.prisma.item.findFirstOrThrow({
              where: { id: itemToDelete.item_id },
            });

            const subtotalToRemove = new Decimal(itemToDelete.amount).mul(itemData.price);

            // 4. Fetch the transaction before update
            const transaction = await this.prisma.transaction.findUniqueOrThrow({
              where: { id: itemToDelete.transaction_id },
            });

            const updatedTotal = new Decimal(transaction.total).sub(subtotalToRemove);

            await this.prisma.transaction.update({
              where: { id: itemToDelete.transaction_id },
              data: { total: updatedTotal },
            });

            // 6. Delete the transaction item
            await this.prisma.transactionItem.delete({
              where: { id: transactionItemId },
            });

            return {
              statusCode: 200,
              message: 'TransactionItem data deleted successfully',
            };
          } catch (error) {
            return {
              statusCode: error.code,
              message: error.message,
            };
          }
        }

}