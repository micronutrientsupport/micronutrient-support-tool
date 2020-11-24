import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-food-items',
  templateUrl: './foodItems.component.html',
  styleUrls: ['./foodItems.component.scss'],
})
export class FoodItemsComponent implements OnInit {
  public desserts: Dessert[] = [
    { name: 'Frozen yogurt', calories: 159, fat: 6, carbs: 24, protein: 4 },
    { name: 'Ice cream sandwich', calories: 237, fat: 9, carbs: 37, protein: 4 },
    { name: 'Eclair', calories: 262, fat: 16, carbs: 24, protein: 6 },
    { name: 'Cupcake', calories: 305, fat: 4, carbs: 67, protein: 4 },
    { name: 'Gingerbread', calories: 356, fat: 16, carbs: 49, protein: 4 },
    { name: 'Pizza Crunch', calories: 1000, fat: 1000, carbs: 1000, protein: 0 },
    { name: 'Cheese', calories: 159, fat: 6, carbs: 24, protein: 4 },
    { name: 'Cake', calories: 262, fat: 16, carbs: 24, protein: 6 },
    { name: 'Strudel', calories: 305, fat: 4, carbs: 67, protein: 4 },
    { name: 'Brownie', calories: 356, fat: 16, carbs: 49, protein: 4 },
    { name: 'Frozen yogurt', calories: 159, fat: 6, carbs: 24, protein: 4 },
    { name: 'Ice cream sandwich', calories: 237, fat: 9, carbs: 37, protein: 4 },
    { name: 'Eclair', calories: 262, fat: 16, carbs: 24, protein: 6 },
    { name: 'Cupcake', calories: 305, fat: 4, carbs: 67, protein: 4 },
    { name: 'Gingerbread', calories: 356, fat: 16, carbs: 49, protein: 4 },
    { name: 'Frozen yogurt', calories: 159, fat: 6, carbs: 24, protein: 4 },
    { name: 'Ice cream sandwich', calories: 237, fat: 9, carbs: 37, protein: 4 },
    { name: 'Eclair', calories: 262, fat: 16, carbs: 24, protein: 6 },
    { name: 'Cupcake', calories: 305, fat: 4, carbs: 67, protein: 4 },
    { name: 'Gingerbread', calories: 356, fat: 16, carbs: 49, protein: 4 },
  ];

  public displayedColumns = ['name', 'calories', 'fat', 'carbs', 'protein'];

  constructor() {}

  ngOnInit(): void {}
}
export interface Dessert {
  calories: number;
  carbs: number;
  fat: number;
  name: string;
  protein: number;
}
