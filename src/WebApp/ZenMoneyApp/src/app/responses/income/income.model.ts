import { IncomeTypeEnum } from "../../enums/income-type.enum";
import { BaseModel } from "../base.model";

export interface IncomeModel extends BaseModel {
    type: number;
    date: string;
    description: string;
    amount: number;
}