export const ExpenseType = {
  Fixed: 1,
  Variable: 2,
} as const;

export type ExpenseTypeEnum = (typeof ExpenseType)[keyof typeof ExpenseType];

export const IncomeType = {
  Fixed: 1,
  Variable: 2,
} as const;

export type IncomeTypeEnum = (typeof IncomeType)[keyof typeof IncomeType];

export const SortDirection = {
  Asc: 0,
  Desc: 1,
} as const;

export type SortDirectionEnum = (typeof SortDirection)[keyof typeof SortDirection];

export const SortField = {
  CreatedAt: 0,
  UpdatedAt: 1,
  Name: 2,
  Description: 3,
  Date: 4,
  Type: 5,
  Amount: 6,
  IsPaid: 7,
  Category: 8,
  PaymentMethod: 9,
} as const;

export type SortFieldEnum = (typeof SortField)[keyof typeof SortField];
