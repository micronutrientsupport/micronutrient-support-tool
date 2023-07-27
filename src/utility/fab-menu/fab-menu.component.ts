import { Component } from '@angular/core';
import { trigger, state, style, animate, transition } from '@angular/animations';

@Component({
  selector: 'app-fab-menu',
  templateUrl: './fab-menu.component.html',
  styleUrls: ['./fab-menu.component.scss'],
  animations: [
    trigger('expandMenu', [
      state('shown', style({ opacity: 1, transform: 'translateY(0)' })),
      state('hidden', style({ opacity: 0, transform: 'translateY(10px)' })),
      transition('hidden <=> shown', animate('200ms ease-in-out')),
    ]),
  ],
})
export class FabMenuComponent {
  menuState: 'shown' | 'hidden' = 'hidden';

  toggleMenu(): void {
    console.debug('call', this.menuState);
    this.menuState = this.menuState === 'hidden' ? 'shown' : 'hidden';
  }

  onMenuItemClick(item: string): void {
    // Add your functionality here for each menu item
    console.log('Menu item clicked:', item);
  }
}
