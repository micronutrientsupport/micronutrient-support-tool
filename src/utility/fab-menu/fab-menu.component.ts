import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Output } from '@angular/core';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { Subject } from 'rxjs/internal/Subject';

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
  @Output() buttonTrigger: Subject<number> = new Subject();

  public menuState: 'shown' | 'hidden' = 'hidden';
  public displayButtons = false;

  toggleMenu(): void {
    this.menuState = this.menuState === 'hidden' ? 'shown' : 'hidden';
    this.displayButtons = this.displayButtons === false ? true : false;
  }

  onMenuItemClick(item: number): void {
    this.buttonTrigger.next(item);
    this.toggleMenu();
  }
}
