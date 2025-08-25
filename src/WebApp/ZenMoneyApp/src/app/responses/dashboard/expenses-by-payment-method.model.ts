import { PaymentMethodModel } from "../payment-method/payment-method.model";

export interface ExpensesByPaymentMethodModel {
    paymentMethod: PaymentMethodModel;
    totalAmount: number;
}