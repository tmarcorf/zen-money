import type { ExpenseTypeEnum, IncomeTypeEnum } from "./enums";

export interface BaseModel {
  id: string;
  createdAt: string;
  updatedAt: string;
}

export interface CategoryModel extends BaseModel {
  name: string;
  user?: UserModel;
}

export interface PaymentMethodModel extends BaseModel {
  description: string;
}

export interface ExpenseModel extends BaseModel {
  type: ExpenseTypeEnum;
  date: string;
  description: string;
  amount: number;
  isPaid: boolean;
  categoryId: string;
  category: CategoryModel;
  paymentMethodId: string;
  paymentMethod: PaymentMethodModel;
}

export interface IncomeModel extends BaseModel {
  type: IncomeTypeEnum;
  date: string;
  description: string;
  amount: number;
}

export interface UserModel {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  incomes?: IncomeModel[];
  expenses?: ExpenseModel[];
}

export interface TokenModel {
  firstName: string;
  email: string;
  token: string;
  expiration: string;
}

export interface IncomesAndExpensesModel {
  month: number;
  year: number;
  currentAmountIncomes: number;
  currentAmountExpenses: number;
}

export interface ExpensesByCategoryModel {
  month: number;
  year: number;
  category: CategoryModel;
  totalAmount: number;
}

export interface ExpensesByPaymentMethodModel {
  month: number;
  year: number;
  paymentMethod: PaymentMethodModel;
  totalAmount: number;
}
