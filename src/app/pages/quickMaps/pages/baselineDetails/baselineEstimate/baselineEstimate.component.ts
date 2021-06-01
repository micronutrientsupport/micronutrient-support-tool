/* eslint-disable @typescript-eslint/dot-notation */
import { ChangeDetectionStrategy, Component, ChangeDetectorRef } from '@angular/core';
import { QuickMapsService } from '../../../quickMaps.service';
import { ActivatedRoute } from '@angular/router';
import { AppRoutes } from 'src/app/routes/routes';
import { ProjectionsSummary } from 'src/app/apiAndObjects/objects/projectionSummary';
import { CurrentDataService } from 'src/app/services/currentData.service';
import { Subscription } from 'rxjs';
import { Unsubscriber } from 'src/app/decorators/unsubscriber.decorator';

interface NameValue {
  name: string;
  value: number;
}
@Unsubscriber('subscriptions')
@Component({
  selector: 'app-base-est',
  templateUrl: './baselineEstimate.component.html',
  styleUrls: ['./baselineEstimate.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BaselineEstimateComponent {
  public readonly DEFAULT_PLACEHOLDER = '-';
  public readonly massArray: NameValue[] = [
    { name: 'mcg', value: 1000 },
    { name: 'mg', value: 1 },
    { name: 'g', value: 0.001 },
    { name: 'kg', value: 0.00001 },
  ];
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
  public massNameValue = this.massArray[1];
  public timeScaleNameValue = this.timeScaleArray[0];

  public ROUTES = AppRoutes;

  private readonly SCENARIO_ID = 'SSP2';
  private subscriptions = new Array<Subscription>();

  constructor(
    public quickMapsService: QuickMapsService,
    private cdr: ChangeDetectorRef,
    public route: ActivatedRoute,
    private currentDataService: CurrentDataService,
  ) {
    this.subscriptions.push(
      this.quickMapsService.parameterChangedObs.subscribe(() => {
        this.updateProjectionSummary();
      }),
    );
  }

  public calculate(): void {
    if (null == this.projectionsSummary) {
      this.targetCalc = null;
      this.currentEstimateCalc = null;
      this.differenceQuantity = null;
    } else {
      const diferrenceQuantityOriginal = this.projectionsSummary.referenceVal - this.projectionsSummary.target;
      const totalMultiplier = this.massNameValue.value * this.timeScaleNameValue.value;

      this.targetCalc = totalMultiplier * this.projectionsSummary.target;
      this.currentEstimateCalc = totalMultiplier * this.projectionsSummary.referenceVal;
      this.differenceQuantity = totalMultiplier * diferrenceQuantityOriginal;
    }
  }

  private updateProjectionSummary(): void {
    this.loading = true;
    void this.currentDataService
      .getProjectionsSummaryCardData(
        this.quickMapsService.country.id,
        this.quickMapsService.micronutrient,
        this.SCENARIO_ID,
      )
      .catch(() => null)
      .then((summary: ProjectionsSummary) => {
        this.projectionsSummary = summary;
      })
      .finally(() => {
        this.calculate();
        this.cdr.markForCheck();
        this.loading = false;
      });
  }
}
