import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../../prisma";
import { CreateItemDto } from "../dto/item-create.dto";
import { UpdateItemDto } from "../dto/item-update.dto";

@Injectable()
export class ItemService{
    constructor(
        private prisma: PrismaService
    ){}
    
        async create(dto: CreateItemDto){
            try{
                const data = await this.prisma.item.create({
                    data: dto
                })
    
                return{
                    statusCode: 201,
                    message: 'Item data created successfully',
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
        async get( itemId: string){
            const data = await this.prisma.item.findFirst({where:{id:itemId}});
    
            return data;
        }
        async getAll(){
            const data = await this.prisma.item.findMany();
            
            return data;
        }
        async getBy(filters: Record<string,any>){
            const where: Record<string, any> = {}
    
            for (const [key, value] of Object.entries(filters)) {
              where[key] = { equals: value };
            }
    
            return await this.prisma.item.findMany({ where });
        }
        async update( itemId:string, dto: UpdateItemDto){
            try{
                const data = await this.prisma.item.update({
                    data:dto,
                    where:{id:itemId}
                })
    
                return{
                    statusCode: 200,
                    message: 'Item data updated successfully',
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
        async delete( itemId: string){
            try{
                await this.prisma.item.delete({where:{id:itemId}});
    
                return{
                    statusCode: 200,
                    message: 'Item data deleted successfully',
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