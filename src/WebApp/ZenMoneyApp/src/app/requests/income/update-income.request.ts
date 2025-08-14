import { CreateIncomeRequest } from "./create-income.request";

export interface UpdateIncomeRequest extends CreateIncomeRequest {
    id: string;
}