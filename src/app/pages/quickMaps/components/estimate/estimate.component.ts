import { ChangeDetectionStrategy, Component, ChangeDetectorRef, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AppRoutes } from 'src/app/routes/routes';
import { ProjectionsSummary } from 'src/app/apiAndObjects/objects/projectionSummary';
import { Subscription } from 'rxjs';
import { Unsubscriber } from 'src/app/decorators/unsubscriber.decorator';
import { QuickMapsService } from '../../quickMaps.service';
import { ProjectionDataService } from 'src/app/services/projectionData.service';
import { DictionaryService } from 'src/app/services/dictionary.service';
import { DictionaryType } from 'src/app/apiAndObjects/api/dictionaryType.enum';
import { ImpactScenarioDictionaryItem } from 'src/app/apiAndObjects/objects/dictionaries/impactScenarioDictionaryItem';
import { DataLevel } from 'src/app/apiAndObjects/objects/enums/dataLevel.enum';

interface NameValue {
  name: string;
  value: number;
}
@Unsubscriber('subscriptions')
@Component({
  selector: 'app-estimate',
  templateUrl: './estimate.component.html',
  styleUrls: ['./estimate.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EstimateComponent {
  @Input() showProjectionLink = false;
  @Input() showFullData = true;

  public readonly DATA_LEVEL = DataLevel;

  public readonly DEFAULT_PLACEHOLDER = '-';
  private readonly massArrayMg: NameValue[] = [
    { name: 'mcg', value: 1000 },
    { name: 'mg', value: 1 },
    { name: 'g', value: 0.001 },
    { name: 'kg', value: 0.00001 },
  ];
  private readonly massArrayMcg: NameValue[] = [
    { name: 'mcg', value: 1 },
    { name: 'mg', value: 0.001 },
    { name: 'g', value: 0.00001 },
    { name: 'kg', value: 0.0000001 },
  ];
  public massArray: NameValue[];
  public readonly timeScaleArray: NameValue[] = [
    { name: 'day', value: 1 },
    { name: 'week', value: 7 },
    { name: 'month', value: 30.4167 },
    { name: 'year', value: 365 },
  ];

  public loading: boolean;
  public projectionsSummary: ProjectionsSummary;
  public targetCalc: number;
  public currentEstimateCalc: number;
  public differenceQuantity: number;
  public massNameValue = this.massArrayMg[1];
  public timeScaleNameValue = this.timeScaleArray[0];

  public ROUTES = AppRoutes;

  private baselineScenario: ImpactScenarioDictionaryItem;
  private subscriptions = new Array<Subscription>();

  constructor(
    public quickMapsService: QuickMapsService,
    private cdr: ChangeDetectorRef,
    public route: ActivatedRoute,
    private dictionaryService: DictionaryService,
    private projectionDataService: ProjectionDataService,
  ) {
    // get baseline scenario
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

  public calculate(): void {
    if (null == this.projectionsSummary) {
      this.targetCalc = null;
      this.currentEstimateCalc = null;
      this.differenceQuantity = null;
    } else {
      const diferrenceQuantityOriginal = this.projectionsSummary.referenceVal - this.projectionsSummary.recommended;
      const totalMultiplier = this.massNameValue.value * this.timeScaleNameValue.value;

      this.targetCalc = totalMultiplier * this.projectionsSummary.recommended;
      this.currentEstimateCalc = totalMultiplier * this.projectionsSummary.referenceVal;
      this.differenceQuantity = totalMultiplier * diferrenceQuantityOriginal;
    }
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
        const unit = this.quickMapsService.micronutrient.get().unit;
        if (unit === 'mcg' || unit === 'mcg RAE') {
          this.massArray = this.massArrayMcg;
          this.massNameValue = this.massArrayMcg[0];
        } else {
          this.massArray = this.massArrayMg;
          this.massNameValue = this.massArrayMg[1];
        }
      })
      .finally(() => {
        this.calculate();
        this.cdr.markForCheck();
        this.loading = false;
      });
  }
}
