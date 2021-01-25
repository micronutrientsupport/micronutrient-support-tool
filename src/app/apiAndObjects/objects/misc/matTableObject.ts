import { MonthlyFoodGroup } from '../monthlyFoodGroup';

export interface MatTableObject {
  data: Array<MonthlyFoodGroup>;
  columnIdentifiers: Array<string>;
}
