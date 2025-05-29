import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { ItemModule } from './modules/item/item.module';
import { TransactionModule } from './modules/transaction/transaction.module';
@Module({
  imports: [
      ConfigModule.forRoot({isGlobal:true}),
      PrismaModule,
      AuthModule,
      UserModule,
      ItemModule,
      TransactionModule
  ],
})
export class AppModule {}
