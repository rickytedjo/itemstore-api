import { Body, Controller, Post } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { RegDto } from "../dto/reg.dto";
import { AuthDto } from "../dto/auth.dto";
import { AuthService } from "../service/auth.service";

@ApiTags("Authentication")
@Controller('api/auth')
export class AuthController {
    constructor(private authService: AuthService){}

    @Post('signup')
    signup(@Body() dto: RegDto){
        return this.authService.signUp(dto);
    }
    
    @Post('signin')
    signin(@Body() dto: AuthDto){
        return this.authService.signIn(dto);
    }
}