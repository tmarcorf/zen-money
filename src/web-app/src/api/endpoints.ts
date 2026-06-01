// Todas as rotas da API centralizadas para facilitar manutencao
export const ENDPOINTS = {
  auth: {
    authenticate: "/api/users/auth",
    validateToken: "/api/users/validate",
    me: "/api/users/me",
    logout: "/api/users/logout",
  },
  users: "/api/users",
  expenses: "/api/expenses",
  expensesPaginated: "/api/expenses/list-paginated",
  incomes: "/api/incomes",
  incomesPaginated: "/api/incomes/list-paginated",
  categories: "/api/categories",
  categoriesPaginated: "/api/categories/list-paginated",
  categoriesByName: "/api/categories/list-name",
  paymentMethods: "/api/payment-methods",
  paymentMethodsPaginated: "/api/payment-methods/list-paginated",
  paymentMethodsByDescription: "/api/payment-methods/list-description",
  dashboard: {
    incomesExpenses: "/api/dashboards/incomes-expenses",
    expensesByCategory: "/api/dashboards/expenses-by-category",
    expensesByPaymentMethod: "/api/dashboards/expenses-by-payment-method",
  },
} as const;
