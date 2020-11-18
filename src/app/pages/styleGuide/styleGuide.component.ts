import {Component} from '@angular/core';
import {FormControl} from '@angular/forms';

@Component({
  selector: 'app-style-guide',
  templateUrl: './styleGuide.component.html',
  styleUrls: ['./styleGuide.component.scss'],
})
export class StyleGuideComponent {

  toppings = new FormControl();

  toppingList: string[] = ['Extra cheese', 'Mushroom', 'Onion', 'Pepperoni', 'Sausage', 'Tomato'];

}
