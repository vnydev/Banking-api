import { TestingModule, Test } from '@nestjs/testing';
import { HttpModule } from '@nestjs/common';
import { BankingService } from './banking.service';
import { MongooseModule } from '@nestjs/mongoose';
import { schemaName, BankAccountSchema} from '../schemas/accounts.schemas';

describe('Banking Service', async () => {
    let bankingService: BankingService;

    beforeEach(async () => {
        const bankModule: TestingModule = await Test.createTestingModule({
            imports: [
                HttpModule,
                MongooseModule.forRoot('mongodb://localhost/bank'),
                // MongooseModule.forRoot(`mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.waqkq.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`),
                MongooseModule.forFeature([{ name: schemaName, schema: BankAccountSchema }]),
            ],
            controllers: [],
            providers: [BankingService],
        }).compile();
        bankingService = bankModule.get<BankingService>(BankingService);

        jest.clearAllMocks();
    })

    it('should create a new bank account', async () => {
        const mockResponse = {
            "accountHistory": [
                {
                    "context": "new account",
                    "createdOn": new Date("2021-06-16T16:34:28.927Z"),
                    "contextType": "NewAccount",
                    "updatedData": null,
                }
            ],
            "initialDeposit": 1000,
            "balance": 1100,
            "identityVerified": false,
            "_id": "60ca2814e083d603def1ecec",
            "name": "Sandeep",
            "DOB": new Date("1992-10-02T18:30:00.000Z"),
            "accountType": "Saving",
            "age": 29,
            "gender": "Male",
            "phoneNumber": 9899242999,
            "nomineeName": "Kamla devi",
            "nomineeAge": 52,
            "address": {
                "area": "Budhvihar phase 2",
                "bulding": "B-43",
                "pincode": 110086,
                "state": "NCR",
                "city": "New Delhi"
            },
            "PAN": "Ghffdsgf43",
            "identityType": "Driving Licence",
            "identityNumber": 768685456,
            "accountStatus": "IN_PROCESS",
            "accountNumber": 6923141760,
            "customerId": 52071731,
            "updatedOn": new Date("2021-06-16T16:34:28.932Z"),
            "openDate": new Date("2021-06-16T16:34:28.932Z"),
            "__v": 0
        }
        const mockNewAccount = {
            "name": "Sandeep",
            "DOB": new Date("10/03/1992"),
            "accountType": "Saving",
            "age": 29,
            "gender": "Male",
            "phoneNumber": 9899242999,
            "nomineeName": "Kamla devi",
            "nomineeAge": 52,
            "address": {
                "area": "Budhvihar phase 2",
                "bulding": "B-43",
                "pincode": 110086,
                "state": "NCR",
                "city": "New Delhi"
            },
            "PAN": "Ghffdsgf43",
            "identityType": "Driving Licence",
            "identityNumber": 768685456,
            "initialDeposit": 1000
        };
        const expectedResult = mockResponse;
        jest
        .spyOn(bankingService, 'create')
        .mockImplementation(_ => Promise.resolve({...mockResponse}));

        expect(await bankingService.create(mockNewAccount)).toStrictEqual(expectedResult);
    });
});