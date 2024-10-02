export interface IDeposit {
    amount: number;
    method: string;
    card: string;
    callback_url?: string;
}
