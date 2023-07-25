import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { DialogService } from 'src/app/components/dialogs/dialog.service';
import { InterventionCreationService } from '../interventionCreation/interventionCreation.service';

@Component({
  selector: 'app-ce-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent implements OnInit {
  public interventionCount: number;
  constructor(
    private dialogService: DialogService,
    private interventionCreationService: InterventionCreationService,
    private cdr: ChangeDetectorRef,
  ) {
    this.interventionCreationService.interventionsSelectedCountObs.subscribe((count: number) => {
      if (count !== null && count !== undefined) {
        this.updateInterventionCount(count);
      }
    });
  }

  ngOnInit(): void {
    this.cdr.detectChanges();
  }

  public updateInterventionCount(count: number) {
    this.interventionCount = count;
    this.cdr.markForCheck();
  }

  public openCEInfoDialog(): void {
    void this.dialogService.openCEInfoDialog();
  }
}
