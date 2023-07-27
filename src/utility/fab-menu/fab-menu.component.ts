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
    trigger('rotateIcon', [
      state('shown', style({ rotate: '90deg' })),
      state('hidden', style({ rotate: '-90deg' })),
      transition('hidden <=> shown', animate('200ms ease-in-out')),
    ]),
  ],
})
export class FabMenuComponent {
  public menuState: 'shown' | 'hidden' = 'hidden';
  public displayMenu = false;

  toggleMenu(): void {
    if (this.menuState === 'hidden') {
      this.displayMenu = true;
      setTimeout(() => (this.menuState = 'shown'));
    } else {
      this.menuState = 'hidden';
      setTimeout(() => (this.displayMenu = false), 200);
    }
  }

  onMenuItemClick(item: string): void {
    // Add your functionality here for each menu item
    console.log('Menu item clicked:', item);
    this.toggleMenu();
  }
}
