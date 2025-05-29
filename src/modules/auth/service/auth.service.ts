import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../../prisma";
import { AuthDto } from "../dto/auth.dto";
import { RegDto } from "../dto/reg.dto";

@Injectable()
export class AuthService{
    constructor(
        private prisma: PrismaService,
        private jwt: JwtService,
        private config: ConfigService
    ){}

    async signToken(userId: string,){
        const payload = {
        sub: userId
    };

    const secret = this.config.get('JWT_SECRET');

    const token = await this.jwt.signAsync(payload, {
      expiresIn: '10080m',
      secret: secret,
    });

    return token;
  }

    async signIn(dto:AuthDto) {
        try{
            const data = await this.prisma.user.findFirst({where:{
                AND: [{email: dto.email},{password: dto.password}]
            }})

            if(data){
                const token = await this.signToken(data.id);
                return {
                    statusCode: 201,
                    message: "Credentials Confirmed",
                    token: token
                };
            }
            else{
                return{
                    statusCode: 401,
                    message: 'Credentials Incorrect',
                }
            }
        }
        catch(error){
            return {
                statusCode: error.code,
                message: error.message
            }
        }
    }
    async signUp(dto:RegDto){
        try{
            const data = await this.prisma.user.create({
                data: dto
            })

            return{
                statusCode: 201,
                message: 'Registration Successful',
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
}