/* eslint-disable @typescript-eslint/dot-notation */
import { ChangeDetectionStrategy, Component, ViewChild, ChangeDetectorRef } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { PopulationGroup } from 'src/app/apiAndObjects/objects/populationGroup';
import { Dictionary } from 'src/app/apiAndObjects/_lib_code/objects/dictionary';
import { QuickMapsService } from '../../../quickMaps.service';
import { DictionaryService } from 'src/app/services/dictionary.service';
import { DictionaryType } from 'src/app/apiAndObjects/api/dictionaryType.enum';
import { FormBuilder, FormGroup } from '@angular/forms';
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
  public popGroupOptions = new Array<PopulationGroup>();
  public loading = false;
  public error = false;
  public countryName = '';
  public vitaminName = '';
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
  apiResponseTarget = 105;
  apiResponseEstimate = 100;
  target = this.apiResponseTarget;
  currentEstimate = this.apiResponseEstimate;
  targetCalc = this.apiResponseTarget;
  currentEstimateCalc = this.apiResponseEstimate;
  mass = 1;
  timeScale = 1;
  timeScaleName = 'day';
  massName = 'mg';
  diferrencePercentage = ((this.currentEstimate - this.target) / this.target) * 100;
  diferrenceQuantity = this.currentEstimate - this.target;

  constructor(
    public quickMapsService: QuickMapsService,
    private dictionaryService: DictionaryService,
    private cdr: ChangeDetectorRef,
    private fb: FormBuilder,

  ) {
    void this.dictionaryService
      .getDictionaries([DictionaryType.COUNTRIES, DictionaryType.REGIONS, DictionaryType.MICRONUTRIENTS])
      .then((dicts: Array<Dictionary>) => {
        this.micronutrientsDictionary = dicts.shift();

        this.quickMapsService.micronutrientIdObs.subscribe((mndsId: string) => {
          const mnds = this.micronutrientsDictionary.getItem(mndsId);
          this.vitaminName = null != mnds ? mnds.name : 'Micronutrient';
          this.cdr.markForCheck();
        });
      });
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

  public calculate(): void {
    const totalMultiplier = this.mass * this.timeScale;
    this.targetCalc = totalMultiplier * this.target;
    this.currentEstimateCalc = totalMultiplier * this.currentEstimate;
    this.diferrenceQuantity *= totalMultiplier;
  }
}

