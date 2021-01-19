import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { TopFoodParams } from 'src/app/apiAndObjects/api/currentData/getTopFood';

@Component({
  selector: 'app-food-items',
  templateUrl: './foodItems.component.html',
  styleUrls: ['./foodItems.component.scss'],
})
export class FoodItemsComponent implements OnInit, AfterViewInit {
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  public topFood: TopFoodParams[];
  // public desserts: Dessert[] = [
  //   { name: 'Frozen yogurt', calories: 159, fat: 6, carbs: 24, protein: 4 },
  //   { name: 'Ice cream sandwich', calories: 237, fat: 9, carbs: 37, protein: 4 },
  //   { name: 'Eclair', calories: 262, fat: 16, carbs: 24, protein: 6 },
  //   { name: 'Cupcake', calories: 305, fat: 4, carbs: 67, protein: 4 },
  //   { name: 'Gingerbread', calories: 356, fat: 16, carbs: 49, protein: 4 },
  //   { name: 'Pizza Crunch', calories: 1000, fat: 1000, carbs: 1000, protein: 0 },
  //   { name: 'Cheese', calories: 159, fat: 6, carbs: 24, protein: 4 },
  //   { name: 'Cake', calories: 262, fat: 16, carbs: 24, protein: 6 },
  //   { name: 'Strudel', calories: 305, fat: 4, carbs: 67, protein: 4 },
  //   { name: 'Brownie', calories: 356, fat: 16, carbs: 49, protein: 4 },
  //   { name: 'Frozen yogurt', calories: 159, fat: 6, carbs: 24, protein: 4 },
  //   { name: 'Ice cream sandwich', calories: 237, fat: 9, carbs: 37, protein: 4 },
  //   { name: 'Eclair', calories: 262, fat: 16, carbs: 24, protein: 6 },
  //   { name: 'Cupcake', calories: 305, fat: 4, carbs: 67, protein: 4 },
  //   { name: 'Gingerbread', calories: 356, fat: 16, carbs: 49, protein: 4 },
  //   { name: 'Frozen yogurt', calories: 159, fat: 6, carbs: 24, protein: 4 },
  //   { name: 'Ice cream sandwich', calories: 237, fat: 9, carbs: 37, protein: 4 },
  //   { name: 'Eclair', calories: 262, fat: 16, carbs: 24, protein: 6 },
  //   { name: 'Cupcake', calories: 305, fat: 4, carbs: 67, protein: 4 },
  //   { name: 'Gingerbread', calories: 356, fat: 16, carbs: 49, protein: 4 },
  // ];

  public displayedColumns = ['name', 'value'];
  public dataSource = new MatTableDataSource();

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.http.get('./assets/exampleData/top-foods.json').subscribe((foodData: TopFoodParams) => {
      // console.log('top food data: ', foodData);
      this.topFood = foodData[0];
      this.dataSource = new MatTableDataSource(this.topFood);
      console.log(this.dataSource);
    });

    // this.dataSource = new MatTableDataSource(this.desserts);
  }

  ngAfterViewInit(): void {
    //   this.dataSource.paginator = this.paginator;
    //   this.dataSource.sort = this.sort;
  }

  // public applyFilter(event: Event): void {
  //   const filterValue = (event.target as HTMLInputElement).value;
  //   this.dataSource.filter = filterValue.trim().toLowerCase();

  //   if (this.dataSource.paginator) {
  //     this.dataSource.paginator.firstPage();
  //   }
  // }
}

// export interface Food {
//   name: string;
//   value: number;
// }
// export interface Dessert {
//   calories: number;
//   carbs: number;
//   fat: number;
//   name: string;
//   protein: number;
// }
