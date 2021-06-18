import { Module, HttpModule } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BankingController } from './banking.controller';
import { BankingService } from './banking.service';
import { schemaName, BankAccountSchema} from '../schemas/accounts.schemas';

@Module({
  imports: [
    HttpModule,
    MongooseModule.forFeature([{ name: schemaName, schema: BankAccountSchema }]),
  ],
  controllers: [BankingController],
  providers: [BankingService],
})
export class BankingModule {}
