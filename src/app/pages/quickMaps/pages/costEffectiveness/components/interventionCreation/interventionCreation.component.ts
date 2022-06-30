import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { DictionaryType } from 'src/app/apiAndObjects/api/dictionaryType.enum';
import { InterventionsDictionaryItem } from 'src/app/apiAndObjects/objects/dictionaries/interventionDictionaryItem';
import { Dictionary } from 'src/app/apiAndObjects/_lib_code/objects/dictionary';
import { DialogData } from 'src/app/components/dialogs/baseDialogService.abstract';
import { DialogService } from 'src/app/components/dialogs/dialog.service';
import { QuickMapsService } from 'src/app/pages/quickMaps/quickMaps.service';
import { DictionaryService } from 'src/app/services/dictionary.service';

@Component({
  selector: 'app-intervention-creation',
  templateUrl: './interventionCreation.component.html',
  styleUrls: ['./interventionCreation.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InterventionCreationComponent {
  public interventionsDictionaryItems: Array<InterventionsDictionaryItem>;
  public selectedInterventions: Array<InterventionsDictionaryItem> = [];

  constructor(
    public quickMapsService: QuickMapsService,
    private dialogService: DialogService,
    private dictionariesService: DictionaryService,
    private cdr: ChangeDetectorRef,
  ) {
    void dictionariesService.getDictionaries([DictionaryType.INTERVENTIONS]).then((dicts: Array<Dictionary>) => {
      this.interventionsDictionaryItems = dicts.shift().getItems();
    });
  }

  public openCESelectionDialog(): void {
    void this.dialogService.openCESelectionDialog(this.interventionsDictionaryItems).then((data: DialogData) => {
      if (Object.keys(data.dataOut).length !== 0) {
        this.selectedInterventions.push(data.dataOut);
      }
      this.cdr.detectChanges();
    });
  }
}
