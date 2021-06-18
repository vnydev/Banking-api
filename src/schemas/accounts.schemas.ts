import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type BankAccountDocument = BankAccount & Document;
export const schemaName = 'Accounts';



@Schema()
export class Address {

    @Prop()
    area: string;

    @Prop()
    bulding: string;

    @Prop({minlength: 6, maxlength: 6})
    pincode: number;

    @Prop()
    state: string;

    @Prop()
    city: string;
}

@Schema()
export class BankAccount {

    @Prop({required: true, trim: true, minlength: 3, maxlength: 50})
    name: string;

    @Prop({required: true})
    DOB: Date;

    @Prop({index: {unique: true}, required: true, minlength: 10, maxlength: 10})
    accountNumber: number;

    @Prop({required: true, enum: ['Saving', 'Current', 'Salary']})
    accountType: string;

    @Prop({required: true, enum: ['ACTIVE', 'IN_ACTIVE', 'ON_HOLD', 'IN_PROCESS', 'CLOSED', 'IN_VERIFICATION']})
    accountStatus: string;

    @Prop({required: true})
    age: number;

    @Prop({required: true, enum: ['Male', 'Female', 'Other']})
    gender: string;

    @Prop({index: {unique: true}, required: true, minlength: 8, maxlength: 8})
    customerId: number;

    @Prop({type: Date, default: Date.now})
    openDate: Date;

    @Prop({type: Date, default: Date.now})
    updatedOn: Date;

    @Prop({required: true, unique: true, minlength: 10, maxlength: 10})
    phoneNumber: number;

    @Prop()
    nomineeName: string;
    
    @Prop()
    nomineeAge: number;

    @Prop({required: true})
    address: Address;
    
    @Prop()
    PAN: string;
    
    @Prop({required: true, enum: ['Aadhar Card', 'Driving Licence']})
    identityType: string;

    @Prop({required: true})
    identityNumber: number;

    @Prop({default: false})
    identityVerified: boolean;

    @Prop({default: 0})
    balance: number;

    @Prop({required: true, default: 0})
    initialDeposit: number;

    @Prop()
    accountHistory: History[];
};

@Schema()
class History {

    @Prop({trim: true, minlength: 3, maxlength: 50})
    context: string;

    @Prop({required: true, enum: ['NewAccount', 'Deposit', "Credit", 'Transfer', 'FD', 'PersonalDetailsUpdate']})
    contextType: string;

    @Prop({required: true})
    updatedData: BankAccount;

    @Prop({type: Date, default: Date.now})
    createdOn: Date;

}

export const BankAccountSchema = SchemaFactory.createForClass(BankAccount);