import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../../prisma";
import { CreateUserDto } from "../dto/user-create.dto";
import { UpdateUserDto } from "../dto/user-update.dto";

@Injectable()
export class UserService{
    constructor(
        private prisma: PrismaService
    ){}
    
        async create(dto: CreateUserDto){
            try{
                const data = await this.prisma.user.create({
                    data: dto
                })
    
                return{
                    statusCode: 201,
                    message: 'User data created successfully',
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
        async get( userId: string){
            const data = await this.prisma.user.findFirst({where:{id:userId}});
    
            return data;
        }
        async getAll(){
            const data = await this.prisma.user.findMany();
            
            return data;
        }
        async getBy(filters: Record<string,any>){
            const where: Record<string, any> = {}
    
            for (const [key, value] of Object.entries(filters)) {
              where[key] = { equals: value };
            }
    
            return await this.prisma.user.findMany({ where });
        }
        async update( userId:string, dto: UpdateUserDto){
            try{
                const data = await this.prisma.user.update({
                    data:dto,
                    where:{id:userId}
                })
    
                return{
                    statusCode: 200,
                    message: 'User data updated successfully',
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
        async delete( userId: string){
            try{
                await this.prisma.user.delete({where:{id:userId}});
    
                return{
                    statusCode: 200,
                    message: 'User data deleted successfully',
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