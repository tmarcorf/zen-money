import type { ExpenseTypeEnum, IncomeTypeEnum, SortDirectionEnum, SortFieldEnum } from "./enums";

// Base search params
export interface SearchParams {
  offset?: number;
  take?: number;
  sortField?: SortFieldEnum;
  sortDirection?: SortDirectionEnum;
}

// Category
export interface SearchCategoryRequest extends SearchParams {
  name?: string;
}

export interface CreateCategoryRequest {
  name: string;
}

export interface UpdateCategoryRequest extends CreateCategoryRequest {
  id: string;
}

// Expense
export interface SearchExpenseRequest extends SearchParams {
  description?: string;
  type?: ExpenseTypeEnum;
  startDate?: string;
  endDate?: string;
  categoryId?: string;
  paymentMethodId?: string;
}

export interface CreateExpenseRequest {
  type: ExpenseTypeEnum;
  date: string;
  description: string;
  amount: number;
  isPaid: boolean;
  categoryId: string;
  paymentMethodId: string;
}

export interface UpdateExpenseRequest extends CreateExpenseRequest {
  id: string;
}

// Income
export interface SearchIncomeRequest extends SearchParams {
  description?: string;
  type?: IncomeTypeEnum;
  startDate?: string;
  endDate?: string;
}

export interface CreateIncomeRequest {
  type: IncomeTypeEnum;
  date: string;
  description: string;
  amount: number;
}

export interface UpdateIncomeRequest extends CreateIncomeRequest {
  id: string;
}

// Payment Method
export interface SearchPaymentMethodRequest extends SearchParams {
  description?: string;
}

export interface CreatePaymentMethodRequest {
  description: string;
}

export interface UpdatePaymentMethodRequest extends CreatePaymentMethodRequest {
  id: string;
}

// Auth / User
export interface AuthUserRequest {
  email: string;
  password: string;
}

export interface CreateUserRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
}

export interface UpdateUserRequest {
  id: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
}

// Investment
export interface SearchInvestmentRequest extends SearchParams {
  name?: string;
  type?: string;
  startDate?: string;
  endDate?: string;
}

export interface CreateInvestmentRequest {
  name: string;
  type: string;
  investedAmount: number;
  currentValue: number;
  date: string;
  notes: string;
}

export interface UpdateInvestmentRequest extends CreateInvestmentRequest {
  id: string;
}
