import { CategoryModel } from "../category/category-model";

export interface ExpensesByCategoryModel {
    category: CategoryModel;
    totalAmount: number;
}