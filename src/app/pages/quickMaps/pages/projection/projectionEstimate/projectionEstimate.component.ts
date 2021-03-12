/* eslint-disable @typescript-eslint/dot-notation */
import { ChangeDetectionStrategy, Component, ViewChild, ChangeDetectorRef } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Dictionary } from 'src/app/apiAndObjects/_lib_code/objects/dictionary';
import { QuickMapsService } from '../../../quickMaps.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CurrentDataService } from 'src/app/services/currentData.service';
import { ProjectionsSummaryCard } from 'src/app/apiAndObjects/objects/projectionsSummaryCard';
import { Subscription } from 'rxjs';
import { NotificationsService } from 'src/app/components/notifications/notification.service';
interface InterfaceTimeMass {
  id: string;
  name: string;
  value: number;
}

@Component({
  selector: 'app-proj-est',
  templateUrl: './projectionEstimate.component.html',
  styleUrls: ['./projectionEstimate.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectionEstimateComponent {
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  public countriesDictionary: Dictionary;
  public regionDictionary: Dictionary;
  public micronutrientsDictionary: Dictionary;
  public loading: boolean;
  public error = false;
  public scenarioId = 'SSP2';
  public projectionEstimateForm: FormGroup;

  public massArray: InterfaceTimeMass[] = [
    { id: '1', name: 'mcg', value: 1000 },
    { id: '2', name: 'mg', value: 1 },
    { id: '3', name: 'g', value: 0.001 },
    { id: '4', name: 'kg', value: 0.00001 },
  ];
  public timeScaleArray: InterfaceTimeMass[] = [
    { id: '1', name: 'day', value: 1 },
    { id: '2', name: 'week', value: 7 },
    { id: '3', name: 'month', value: 30.4167 },
    { id: '4', name: 'year', value: 365 },
  ];
  target: number;
  currentEstimate: number;
  targetCalc: number;
  currentEstimateCalc: number;
  differencePercentage: number;
  differenceQuantity: number;
  referenceYear: string;
  intersectYear: string;
  mass = 1;
  timeScale = 1;
  timeScaleName = 'day';
  massName = 'mg';

  private subscriptions = new Array<Subscription>();

  constructor(
    public quickMapsService: QuickMapsService,
    private cdr: ChangeDetectorRef,
    private fb: FormBuilder,
    private currentDataService: CurrentDataService,
    private notificationService: NotificationsService,
  ) {
    this.subscriptions.push(
      this.quickMapsService.parameterChangedObs.subscribe(() => {
        this.callToApi();
      }),
    );

    this.projectionEstimateForm = this.fb.group({
      mass: this.massArray[1],
      timeScale: this.timeScaleArray[0],
    });

    this.projectionEstimateForm.get('mass').valueChanges.subscribe((itemMass: InterfaceTimeMass) => {
      this.mass = itemMass.value;
      this.massName = itemMass.name;
      this.calculate();
    });
    this.projectionEstimateForm.get('timeScale').valueChanges.subscribe((itemTime: InterfaceTimeMass) => {
      console.log(itemTime);
      this.timeScale = itemTime.value;
      this.timeScaleName = itemTime.name;
      this.calculate();
    });
  }

  public callToApi(): void {
    this.loading = true;
    void this.currentDataService
      .getProjectionsSummaryCardData(
        this.quickMapsService.country.id,
        this.quickMapsService.micronutrient,
        this.scenarioId,
      )
      .then((response: Array<ProjectionsSummaryCard>) => {
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
    const totalMultiplier = this.mass * this.timeScale;

    this.targetCalc = totalMultiplier * this.target;
    this.currentEstimateCalc = totalMultiplier * this.currentEstimate;
    this.differenceQuantity = totalMultiplier * diferrenceQuantityOriginal;
  }
}
