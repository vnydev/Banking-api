import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { BankingModule } from './banking/banking.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(`mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.waqkq.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`),
    BankingModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
