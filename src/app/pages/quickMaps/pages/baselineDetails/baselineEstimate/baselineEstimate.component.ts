/* eslint-disable @typescript-eslint/dot-notation */
import { ChangeDetectionStrategy, Component, ChangeDetectorRef } from '@angular/core';
import { QuickMapsService } from '../../../quickMaps.service';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AppRoutes } from 'src/app/routes/routes';
import { ProjectionsSummary } from 'src/app/apiAndObjects/objects/projectionsSummary';
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
export class BaslineEstimateComponent {
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

  public summar;

  target: number;
  currentEstimate: number;
  targetCalc: number;
  currentEstimateCalc: number;
  differencePercentage: number;
  differenceQuantity: number;
  referenceYear: string;
  intersectYear: string;

  public massNameValue = this.massArray[1];
  public timeScaleNameValue = this.timeScaleArray[0];

  public ROUTES = AppRoutes;

  private readonly SCENARIO_ID = 'SSP2';
  private subscriptions = new Array<Subscription>();

  constructor(
    public quickMapsService: QuickMapsService,
    private cdr: ChangeDetectorRef,
    private fb: FormBuilder,
    public route: ActivatedRoute,
    private currentDataService: CurrentDataService,
  ) {
    this.subscriptions.push(
      this.quickMapsService.parameterChangedObs.subscribe(() => {
        this.callToApi();
      }),
    );
  }

  public callToApi(): void {
    this.loading = true;
    void this.currentDataService
      .getProjectionsSummaryCardData(
        this.quickMapsService.country.id,
        this.quickMapsService.micronutrient,
        this.SCENARIO_ID,
      )
      .then((response: Array<ProjectionsSummary>) => {
        this.target = response[0].target;
        this.currentEstimate = response[0].referenceVal;
        this.differencePercentage = response[0].difference;
        this.referenceYear = response[0].referenceYear.toString();
        this.intersectYear = response[0].intersectYear.toString();
        this.calculate();
      })
      .catch(() => {
        this.targetCalc = null;
        this.currentEstimateCalc = null;
        this.differencePercentage = null;
        this.differenceQuantity = null;
        this.referenceYear = null;
        this.intersectYear = null;
      })
      .finally(() => {
        this.cdr.markForCheck();
        this.loading = false;
      });
  }

  public calculate(): void {
    const diferrenceQuantityOriginal = this.currentEstimate - this.target;
    const totalMultiplier = this.massNameValue.value * this.timeScaleNameValue.value;

    this.targetCalc = totalMultiplier * this.target;
    this.currentEstimateCalc = totalMultiplier * this.currentEstimate;
    this.differenceQuantity = totalMultiplier * diferrenceQuantityOriginal;
  }
}
