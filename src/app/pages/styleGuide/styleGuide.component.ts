import {Component} from '@angular/core';
import {UntypedFormControl} from '@angular/forms';

@Component({
  selector: 'app-style-guide',
  templateUrl: './styleGuide.component.html',
  styleUrls: ['./styleGuide.component.scss'],
})
export class StyleGuideComponent {

  toppings = new UntypedFormControl();

  toppingList: string[] = ['Extra cheese', 'Mushroom', 'Onion', 'Pepperoni', 'Sausage', 'Tomato'];

}
