import { Component, OnInit } from '@angular/core';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { DialogService } from 'src/app/components/dialogs/dialog.service';

@Component({
  selector: 'app-food-composition-view',
  templateUrl: './food-composition-view.component.html',
  styleUrls: ['./food-composition-view.component.scss'],
})
export class FoodCompositionViewComponent implements OnInit {
  private content: any;

  constructor(private modalService: DialogService) {}

  ngOnInit(): void {}

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
    void this.modalService.openChart('Food composition modal');
  }
}
