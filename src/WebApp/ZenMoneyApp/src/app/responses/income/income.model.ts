import { IncomeTypeEnum } from "../../enums/income-type.enum";
import { BaseModel } from "../base.model";

export interface IncomeModel extends BaseModel {
    type: IncomeTypeEnum;
    date: string;
    description: string;
    amount: number;
}