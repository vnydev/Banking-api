import { TestingModule, Test } from '@nestjs/testing';
import { HttpModule } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { BankingController } from './banking.controller';
import { BankingService } from './banking.service';
import { schemaName, BankAccountSchema} from '../schemas/accounts.schemas';

describe('Banking Controller', async () => {
    let bankingController: BankingController;
    let bankingService: BankingService;

    beforeEach(async () => {
        const bankModule: TestingModule = await Test.createTestingModule({
            imports: [
                HttpModule,
                MongooseModule.forRoot('mongodb://localhost/bank'),
                // MongooseModule.forRoot(`mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.waqkq.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`),
                MongooseModule.forFeature([{ name: schemaName, schema: BankAccountSchema }]),
            ],
            controllers: [BankingController],
            providers: [BankingService],
        }).compile();
        bankingService = bankModule.get<BankingService>(BankingService);
        bankingController = bankModule.get<BankingController>(BankingController);

        jest.clearAllMocks();
    })

    it('should create a new bank account - bankingController.create', async () => {
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
        const expectedResult = {
            "status": 200,
            "message": "Account successfully created",
            "data": {
                "name": "Sandeep",
                "accountNumber": 6923141760
            }
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

        jest
        .spyOn(bankingService, 'create')
        .mockImplementation(_ => Promise.resolve({...mockResponse}));

        expect(await bankingController.create(mockNewAccount)).toStrictEqual(expectedResult);
    });

    it('should transfer amount from one account to another.', async () => {
  
        const transferDetails = {
            "accountTo": 6923141760,
            "accountFrom": 3445128542,
            "transferAmount": 100
        }
        const expectedResult = {
            status: 200,
            message: "Successfully Transfer",
        }
        const accTo = {
            "accountHistory": [
                {
                    "context": "new account",
                    "createdOn": new Date("2021-06-16T18:48:39.950Z"),
                    "contextType": "NewAccount",
                    "updatedData": null,
                }
            ],
            "initialDeposit": 1000,
            "balance": 1000,
            "identityVerified": false,
            "_id": "60ca4788e0a1ed0b159be762",
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
            "accountNumber": 6174702416,
            "customerId": 40698641,
            "updatedOn": new Date("2021-06-16T18:48:40.020Z"),
            "openDate": new Date("2021-06-16T18:48:40.020Z"),
            "__v": 0
        }
        const accFrom = {
            "accountHistory": [
                {
                    "context": "new account",
                    "createdOn": new Date("2021-06-18T08:14:49.626Z"),
                    "contextType": "NewAccount",
                    "updatedData": null
                }
            ],
            "initialDeposit": 1000,
            "balance": 1000,
            "identityVerified": false,
            "_id": "60cc55f9018ada1e2301c97c",
            "name": "Viney Sharma",
            "DOB": new Date("1994-02-10T18:30:00.000Z"),
            "accountType": "Saving",
            "age": 27,
            "gender": "Male",
            "phoneNumber": 9818427650,
            "nomineeName": "Anita Sharma",
            "nomineeAge": 55,
            "address": {
                "area": "Mange ram park",
                "bulding": "D-1/A",
                "pincode": 110086,
                "state": "NCR",
                "city": "New Delhi"
            },
            "PAN": "Ghffdsgf43",
            "identityType": "Driving Licence",
            "identityNumber": 889833333,
            "accountStatus": "IN_PROCESS",
            "accountNumber": 3445128542,
            "customerId": 62633434,
            "updatedOn": new Date("2021-06-18T08:14:49.662Z"),
            "openDate": new Date("2021-06-18T08:14:49.662Z"),
            "__v": 0
        }
        jest
        .spyOn(bankingService, 'getOne')
        .mockImplementation(_ => Promise.resolve(accTo));
        jest
        .spyOn(bankingService, 'getOne')
        .mockImplementation(_ => Promise.resolve(accFrom));
        
        expect(await bankingService.getOne({accountNumber: 6174702416})).not.toBeNull();
        expect(await bankingService.getOne({accountNumber: 3445128542})).not.toBeNull();
        expect(await bankingController.transfer(transferDetails)).toStrictEqual(expectedResult);

    })
});