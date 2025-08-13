import { CreatePaymentMethodRequest } from "./create-payment-method.request";

export interface UpdatePaymentMethodRequest extends CreatePaymentMethodRequest{
    id: string;
}