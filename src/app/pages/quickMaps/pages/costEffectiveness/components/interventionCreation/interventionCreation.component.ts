import { ChangeDetectorRef, Component } from '@angular/core';
import { DictionaryType } from 'src/app/apiAndObjects/api/dictionaryType.enum';
import { InterventionsDictionaryItem } from 'src/app/apiAndObjects/objects/dictionaries/interventionDictionaryItem';
import { Dictionary } from 'src/app/apiAndObjects/_lib_code/objects/dictionary';
import { DialogData } from 'src/app/components/dialogs/baseDialogService.abstract';
import { DialogService } from 'src/app/components/dialogs/dialog.service';
import { QuickMapsService } from 'src/app/pages/quickMaps/quickMaps.service';
import { DictionaryService } from 'src/app/services/dictionary.service';
import { Subscription } from 'rxjs';
import { InterventionDataService } from 'src/app/services/interventionData.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-intervention-creation',
  templateUrl: './interventionCreation.component.html',
  styleUrls: ['./interventionCreation.component.scss'],
})
export class InterventionCreationComponent {
  public interventionsDictionaryItems: Array<InterventionsDictionaryItem>;
  public selectedInterventions: Array<InterventionsDictionaryItem> = [];
  public routerSubscription: Subscription;
  constructor(
    public quickMapsService: QuickMapsService,
    private dialogService: DialogService,
    private dictionariesService: DictionaryService,
    private interventionService: InterventionDataService,
    private cdr: ChangeDetectorRef,
    private readonly route: ActivatedRoute,
    private router: Router,
  ) {
    void dictionariesService.getDictionaries([DictionaryType.INTERVENTIONS]).then((dicts: Array<Dictionary>) => {
      this.interventionsDictionaryItems = dicts.shift().getItems();
      this.loadInterventions();
    });
  }
  public async loadInterventions(): Promise<void> {
    this.route.queryParamMap
      .subscribe(async (queryParams) => {
        const inteventionIds: Array<string> = queryParams.get('intIds') ? JSON.parse(queryParams.get('intIds')) : [];
        for (const id of inteventionIds) {
          await this.interventionService.getIntervention(id).then((data: InterventionsDictionaryItem) => {
            this.selectedInterventions.push(data);
            this.cdr.detectChanges();
          });
        }
      })
      // Need to unsubsscribe to prevent additional calls when new intervention added
      .unsubscribe();
  }
  public openCESelectionDialog(): void {
    void this.dialogService.openCESelectionDialog(this.interventionsDictionaryItems).then((data: DialogData) => {
      if (Object.keys(data.dataOut).length !== 0) {
        const inteventionIds = this.route.snapshot.queryParamMap.get('intIds')
          ? JSON.parse(this.route.snapshot.queryParamMap.get('intIds')).map(Number)
          : [];
        this.router.navigate([], {
          relativeTo: this.route,
          queryParams: { intIds: JSON.stringify([...inteventionIds, +data.dataOut.id]) },
          queryParamsHandling: 'merge',
        });
        this.selectedInterventions.push(data.dataOut);
        this.cdr.detectChanges();
      }
    });
  }
}