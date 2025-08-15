export interface CreateExpenseRequest {
    type: number;
    date: string;
    description: string;
    amount: number;
    isPaid: boolean;
    categoryId: string;
    paymentMethodId: string;
}