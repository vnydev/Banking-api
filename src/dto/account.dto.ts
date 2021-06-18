import { Expose } from 'class-transformer';

class Address {
    area: string;
    bulding: string;
    pincode: number;
    state: string;
    city: string;
}

class History {
    context: string;
    contextType: string;
    createdOn: Date;
    updatedData: AccountDto | null;
}

export class AccountDto {
    name: string;
    DOB: Date;
    accountNumber?: number;
    accountType: string;
    accountStatus?: string;
    age: number;
    gender: string;
    customerId?: number;
    openDate?: Date;
    updatedOn?: Date;
    phoneNumber: number;
    nomineeName: string;
    nomineeAge: number;
    address: Address;
    PAN: string;
    identityType: string;
    identityNumber: number;
    identityVerified?: boolean;
    balance?: number;
    initialDeposit?: number;
    accountHistory?: History[];
}