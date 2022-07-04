import { ChangeDetectionStrategy, ChangeDetectorRef, Component, AfterViewInit } from '@angular/core';
import { DictionaryType } from 'src/app/apiAndObjects/api/dictionaryType.enum';
import { InterventionsDictionaryItem } from 'src/app/apiAndObjects/objects/dictionaries/interventionDictionaryItem';
import { Dictionary } from 'src/app/apiAndObjects/_lib_code/objects/dictionary';
import { DialogData } from 'src/app/components/dialogs/baseDialogService.abstract';
import { DialogService } from 'src/app/components/dialogs/dialog.service';
import { QuickMapsService } from 'src/app/pages/quickMaps/quickMaps.service';
import { DictionaryService } from 'src/app/services/dictionary.service';
import { Location } from '@angular/common';
import { Subscription } from 'rxjs';
import { InterventionDataService } from 'src/app/services/interventionData.service';

@Component({
  selector: 'app-intervention-creation',
  templateUrl: './interventionCreation.component.html',
  styleUrls: ['./interventionCreation.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default,
})
export class InterventionCreationComponent implements AfterViewInit {
  public interventionsDictionaryItems: Array<InterventionsDictionaryItem>;
  public selectedInterventions: Array<InterventionsDictionaryItem> = [];
  public routerSubscription: Subscription;

  constructor(
    public quickMapsService: QuickMapsService,
    private dialogService: DialogService,
    private dictionariesService: DictionaryService,
    private interventionService: InterventionDataService,
    private cdr: ChangeDetectorRef,
    private location: Location,
  ) {
    void dictionariesService.getDictionaries([DictionaryType.INTERVENTIONS]).then((dicts: Array<Dictionary>) => {
      this.interventionsDictionaryItems = dicts.shift().getItems();
    });
  }

  ngAfterViewInit() {
    this.loadInterventions()
  }

  public async loadInterventions(): Promise<any> {
    const searchParams = new URLSearchParams(window.location.search);
    const inteventionIds = searchParams.getAll('intervention_ids');
    for (const id of inteventionIds) {
      await this.interventionService.getIntervention(id).then((data: any) => {
        this.selectedInterventions.push(data);
        this.cdr.detectChanges();
      });
    }
  }

  public openCESelectionDialog(): void {
    void this.dialogService.openCESelectionDialog(this.interventionsDictionaryItems).then((data: DialogData) => {
      const searchParams = new URLSearchParams(window.location.search);
      searchParams.append('intervention_ids', data.dataOut.id)
      this.location.replaceState(`${location.pathname}?${searchParams}`);

      this.selectedInterventions.push(data.dataOut);
      this.cdr.detectChanges();
    });
  }
}
