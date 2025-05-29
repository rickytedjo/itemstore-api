import { Injectable } from "@nestjs/common";
import { CreateTransactionDto } from "../dto/transaction-create.dto";
import { UpdateTransactionDto } from "../dto/transaction-update.dto";
import { PrismaService } from "../../../prisma";

@Injectable()
export class TransactionService{
    constructor(
        private prisma: PrismaService
    ){}

    async create(dto:CreateTransactionDto){
        const TransactionData : any = {...dto};
        
        try{
            const transaction = await this.prisma.transaction.create({data:TransactionData});

            return {
                statusCode:201,
                message:"Transaction data successfully created",
                data: transaction
            }
        }
        catch(error){
            return {
                statusCode: error.code,
                message:error.message
            }
        }
    }
    async get( transactionId: string){
        const data = await this.prisma.transaction.findFirst({where:{id:transactionId}});

        return data;
    }
    async getAll(){
        const data = await this.prisma.transaction.findMany();
        
        return data;
    }
    async getBy(filters: Record<string,any>){
        const where: Record<string, any> = {}

        for (const [key, value] of Object.entries(filters)) {
          where[key] = { equals: value };
        }

        return await this.prisma.transaction.findMany({ where });
    }
    async update( transactionId:string, dto: UpdateTransactionDto){
        try{
            const data = await this.prisma.transaction.update({
                data:dto,
                where:{id:transactionId}
            })

            return{
                statusCode: 200,
                message: 'Transaction data updated successfully',
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
    async delete( transactionId: string){
        try{
            await this.prisma.transaction.delete({where:{id:transactionId}});

            return{
                statusCode: 200,
                message: 'Transaction data deleted successfully',
            }
        }
        catch(error){
            return {
                statusCode: error.code,
                message: error.message
            }
        }
    }
    
}