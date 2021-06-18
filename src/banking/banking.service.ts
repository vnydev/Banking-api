import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { AxiosResponse } from 'axios';

import { BankAccount, BankAccountDocument, schemaName } from '../schemas/accounts.schemas';
import { AccountDto } from '../dto/account.dto';

@Injectable()
export class BankingService {
  constructor(@InjectModel(schemaName) private accountModel: Model<BankAccountDocument>) {}

  async create(account: AccountDto): Promise<BankAccount> {
    try {
      const createdCat = new this.accountModel(account);
      const result = await createdCat.save();
      return result;
    } catch (error) {
      // log exception
      throw new Error(error);
    }
  }

  async getOne(filterContext: object, select?: string): Promise<BankAccount> {
    return await this.accountModel.findOne({...filterContext}).select(select).exec();
  }

  async getByContext(filterContext: object, options?: object, select?: string): Promise<BankAccount[]> {
    return await this.accountModel.find({...filterContext}, {...options}).select(select).exec();
  }

  async updateOne(filterContext: object, data: object): Promise<any> {
    return await this.accountModel.updateOne(filterContext, data).exec();
  }
}
