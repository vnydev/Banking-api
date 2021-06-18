
export interface SuccessResponse {
    status: number;
    message?: string;
    data?: object;
}

export interface ErrorResponse {
    status: number;
    error: string;
}

export interface TransferAmount {
    accountTo: number;
    accountFrom: number;
    transferAmount: number;
    label?: string;
}