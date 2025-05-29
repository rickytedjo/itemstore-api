import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { JwtStrategy } from "./strategy/jwt.strategy";
import { AuthController } from "./controller/auth.controller";
import { AuthService } from "./service/auth.service";

@Module({
    imports:[
        JwtModule.register({})
    ],
    controllers:[
        AuthController
    ],
    providers:[
        AuthService,
        JwtStrategy
    ]
})
export class AuthModule{}