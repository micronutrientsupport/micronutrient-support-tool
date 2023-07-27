import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-fab-button',
  templateUrl: './fab-button.component.html',
  styleUrls: ['./fab-button.component.scss'],
})
export class FabButtonComponent {
  @Input() icon: string;
  onClick(): void {
    // Add functionality here when the FAB is clicked.
    console.log('Floating action button clicked!');
  }
}

//look at ways to inject an icon
//style in accordance with maps theme
