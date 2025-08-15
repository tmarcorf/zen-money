import { ExpenseTypeEnum } from "../../enums/expense-type.enum";
import { BaseModel } from "../base.model";
import { CategoryModel } from "../category/category-model";
import { PaymentMethodModel } from "../payment-method/payment-method.model";

export interface ExpenseModel extends BaseModel {
    type: number;
    date: string;
    description: string;
    amount: number;
    isPaid: boolean;
    category: CategoryModel;
    paymentMethod: PaymentMethodModel;
}