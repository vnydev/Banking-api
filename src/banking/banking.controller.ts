import { Controller, Get, Post, Body, HttpStatus, HttpException, Param } from '@nestjs/common';
import { AccountDto } from '../dto/account.dto';
import { BankingService } from './banking.service';
import { ErrorResponse, SuccessResponse, TransferAmount } from '../interfaces/bank.interfaces';

type ReponseType = SuccessResponse | ErrorResponse;

@Controller('banking')
export class BankingController {
    constructor(private readonly bankingService: BankingService) { }

    @Get('/')
    greeting(): string {
        return 'Welcome to banking'
    }
    
    @Get('/:accountNumber')
    async getAccount(
        @Param('accountNumber') accountNumber: string,
    ): Promise<AccountDto> {
        return await this.bankingService.getOne({ accountNumber});
    }

    /**
     * 
     * @param accountDetails create bank account by passing account details in body
     * @returns 
     */
    @Post('/create/account')
    async create(@Body() accountDetails: AccountDto): Promise<ReponseType> {
        try {
            const newAccount: AccountDto = {
                ...accountDetails,
                accountStatus: 'IN_PROCESS',
                accountNumber: Math.floor(Math.random() * 10000000000),
                customerId: Math.floor(Math.random() * 100000000),
                balance: accountDetails.initialDeposit,
                accountHistory: [
                    {
                        context: 'new account',
                        createdOn: new Date(),
                        contextType: 'NewAccount',
                        updatedData: null,
                    }
                ]
            }
            newAccount.accountHistory[0].updatedData = { ...newAccount }
            delete newAccount.accountHistory[0]?.updatedData.accountHistory;
            const checkAccount = await this.bankingService.getOne({ name: newAccount.name, accountType: newAccount.accountType });
            if (checkAccount && checkAccount !== null) {
                throw new Error(`Account is already created for account type - ${newAccount.accountType}`);
                return
            }

            const result = this.bankingService.create(newAccount);

            return {
                status: HttpStatus.OK,
                message: 'Account successfully created',
                data: {
                    name: (await result).name,
                    accountNumber: (await result).accountNumber,
                }
            }
        } catch (error) {
            throw new HttpException({
                status: HttpStatus.NOT_ACCEPTABLE,
                error: error.message,
            }, HttpStatus.NOT_ACCEPTABLE);
        }
    }

    /**
     * 
     * @param body Transfer amount between to accounts
     * @returns 
     */
    @Post('/transfer')
    async transfer(
        @Body() body: TransferAmount
    ): Promise<ReponseType> {
        try {
            const { accountFrom, accountTo, transferAmount, label } = body;
            const checkoutAccTo = await this.bankingService.getOne({ accountNumber: accountTo });
            const checkoutAccFrom = await this.bankingService.getOne({ accountNumber: accountFrom });
            if (!checkoutAccTo || checkoutAccTo === null) {
                throw new Error('Transfer account does not exist.');
            }

            if (!checkoutAccFrom || checkoutAccFrom === null) {
                throw new Error('Account does not exist to transfer.');
            } else if (checkoutAccFrom && checkoutAccFrom.balance < transferAmount) {
                throw new Error('Account balance is not good enough to transfer amount.');
            }

            const updateAccFrom = {
                balance: checkoutAccFrom.balance - transferAmount,
                $push: {
                    accountHistory: {
                        context: 'Transfer amount',
                        createdOn: new Date(),
                        contextType: 'Transfer',
                        updatedData: {
                            previousBalance: checkoutAccFrom.balance,
                            currentBalance: checkoutAccFrom.balance - transferAmount,
                            transferAmount,
                        },
                    },
                },
            }
            const updateAccTo = {
                balance: checkoutAccTo.balance + transferAmount,
                $push: {
                    accountHistory: {
                        context: label || 'Recieved transfer amount',
                        createdOn: new Date(),
                        contextType: 'Transfer',
                        updatedData: {
                            previousBalance: checkoutAccTo.balance,
                            currentBalance: checkoutAccTo.balance + transferAmount,
                            transferAmount,
                        },
                    },
                },
            }
            const transferFrom = await this.bankingService.updateOne({accountNumber: accountFrom}, updateAccFrom);
            const transferTo = await this.bankingService.updateOne({accountNumber: accountTo}, updateAccTo);
          
            return {
                status: HttpStatus.OK,
                message: "Successfully Transfer",
            }
        } catch (error) {
            throw new HttpException({
                status: HttpStatus.NOT_MODIFIED,
                error: error.message,
            }, HttpStatus.NOT_MODIFIED);
        }
    }

    /**
     * 
     * @param accountNumber Retrive balance by account number
     * @returns 
     */
    @Get('/account/balance/:accountNumber')
    async getAccountBalance(
        @Param('accountNumber') accountNumber: string,
    ): Promise<ReponseType> {
        try {
            const result = await this.bankingService.getOne({ accountNumber: parseInt(accountNumber) }, 'balance');
            return {
                status: HttpStatus.OK,
                data: result,
            }
        } catch (error) {
            throw new HttpException({
                status: HttpStatus.INTERNAL_SERVER_ERROR,
                error: error.message,
            }, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * 
     * @param accountNumber Retrive transfer history by account number
     * @returns 
     */
    @Get('/account/history/:accountNumber')
    async getAccountTransferHistory(
        @Param('accountNumber') accountNumber: string,
    ): Promise<ReponseType> {
        try {
            const result = await this.bankingService.getByContext(
                { accountNumber: parseInt(accountNumber), accountHistory: { $elemMatch: { contextType: "Transfer" } } },
                {},
                '');
            return {
                status: HttpStatus.OK,
                data: result[0] ? result[0].accountHistory : null,
            }
        } catch (error) {
            throw new HttpException({
                status: HttpStatus.INTERNAL_SERVER_ERROR,
                error: error.message,
            }, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}