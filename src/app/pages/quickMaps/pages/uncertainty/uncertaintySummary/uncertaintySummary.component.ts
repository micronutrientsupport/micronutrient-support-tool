import { ChangeDetectorRef, Component } from '@angular/core';
import { Subscription } from 'rxjs';
import { DictionaryType } from 'src/app/apiAndObjects/api/dictionaryType.enum';
import { ImpactScenarioDictionaryItem } from 'src/app/apiAndObjects/objects/dictionaries/impactScenarioDictionaryItem';
import { ProjectionsSummary } from 'src/app/apiAndObjects/objects/projectionSummary';
import { DictionaryService } from 'src/app/services/dictionary.service';
import { ProjectionDataService } from 'src/app/services/projectionData.service';
import { QuickMapsService } from '../../../quickMaps.service';

@Component({
  selector: 'app-uncertainty-summary',
  templateUrl: './uncertaintySummary.component.html',
  styleUrls: ['./uncertaintySummary.component.scss'],
})
export class UncertaintySummaryComponent {
  public loading: boolean;
  public projectionsSummary: ProjectionsSummary;
  private baselineScenario: ImpactScenarioDictionaryItem;
  private subscriptions = new Array<Subscription>();

  constructor(
    public quickMapsService: QuickMapsService,
    private readonly cdr: ChangeDetectorRef,
    private readonly dictionaryService: DictionaryService,
    private readonly projectionDataService: ProjectionDataService,
  ) {
    void this.dictionaryService.getDictionaries([DictionaryType.IMPACT_SCENARIOS]).then((dicts) => {
      this.baselineScenario = dicts
        .shift()
        .getItems<ImpactScenarioDictionaryItem>()
        .find((item) => item.isBaseline);

      this.subscriptions.push(
        this.quickMapsService.parameterChangedObs.subscribe(() => {
          this.updateProjectionSummary();
        }),
      );
    });
  }

  private updateProjectionSummary(): void {
    this.loading = true;
    void this.projectionDataService
      .getProjectionSummaries(
        this.quickMapsService.country.get(),
        this.quickMapsService.micronutrient.get(),
        this.baselineScenario,
      )
      .catch(() => null)
      .then((summary: ProjectionsSummary) => {
        this.projectionsSummary = summary;
      })
      .finally(() => {
        // this.calculate();
        this.cdr.markForCheck();
        this.loading = false;
      });
  }
  // ngOnInit() {
  // }
}
