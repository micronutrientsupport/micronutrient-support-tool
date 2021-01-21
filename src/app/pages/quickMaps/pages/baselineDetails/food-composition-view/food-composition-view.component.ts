import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
  ViewEncapsulation,
  EventEmitter,
  OnDestroy,
} from '@angular/core';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { GridsterItem } from 'angular-gridster2';
import { Subscription } from 'rxjs';
import { DialogService } from 'src/app/components/dialogs/dialog.service';

@Component({
  selector: 'app-food-composition-view',
  templateUrl: './food-composition-view.component.html',
  styleUrls: ['./food-composition-view.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class FoodCompositionViewComponent implements OnInit, OnDestroy {
  @Input()
  widget;
  @Input()
  resizeEvent: EventEmitter<GridsterItem>;
  resizeSub: Subscription;
  constructor(private modalService: DialogService) {}

  ngOnInit(): void {
    this.resizeSub = this.resizeEvent.subscribe((widget) => {
      if (widget === this.widget) {
        // or check id , type or whatever you have there
        // resize your widget, chart, map , etc.
        // console.log(widget);
      }
    });
  }

  ngOnDestroy(): void {
    this.resizeSub.unsubscribe();
  }

  public tabChanged(tabChangeEvent: MatTabChangeEvent): void {
    if (tabChangeEvent.index === 1) {
      // food composition tab
    } else if (tabChangeEvent.index === 2) {
      // Threshold tab
    } else {
      // index 0
    }
  }

  public openDialog(): void {
    // get the active tab content and push to the modal;
    // void this.modalService.openChartDialog('Food composition modal');
  }
}
