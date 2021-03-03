/* eslint-disable @typescript-eslint/dot-notation */
import { ChangeDetectionStrategy, Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { PopulationGroup } from 'src/app/apiAndObjects/objects/populationGroup';
import { Dictionary } from 'src/app/apiAndObjects/_lib_code/objects/dictionary';
import { QuickMapsService } from '../../../quickMaps.service';
import { DictionaryService } from 'src/app/services/dictionary.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-proj-est',
  templateUrl: './projectionEstimate.component.html',
  styleUrls: ['./projectionEstimate.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectionEstimateComponent implements OnInit {
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  public countriesDictionary: Dictionary;
  public regionDictionary: Dictionary;
  public micronutrientsDictionary: Dictionary;
  public popGroupOptions = new Array<PopulationGroup>();
  public loading = false;
  public error = false;

  public projectionEstimateForm: FormGroup;

  public massArray = [
    { id: '1', name: 'mcg', value: 1000 },
    { id: '2', name: 'mg', value: 1 },
    { id: '3', name: 'g', value: 0.001 },
    { id: '4', name: 'kg', value: 0.00001 },
  ];
  public timeScaleArray = [
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
  diferrence = ((this.currentEstimate - this.target) / this.target) * 100;

  constructor(
    public quickMapsService: QuickMapsService,
    // private dictionaryService: DictionaryService,
    // private cdr: ChangeDetectorRef,
    private fb: FormBuilder,
  ) {
    this.projectionEstimateForm = this.fb.group({
      mass: this.massArray[2],
      timeScale: this.timeScaleArray[2],
    });

    this.projectionEstimateForm.get('mass').valueChanges.subscribe(itemMass => {
      this.mass = itemMass.value;
      this.calculate();
    });
    this.projectionEstimateForm.get('timeScale').valueChanges.subscribe(itemTime => {
      this.timeScale = itemTime.value;
      this.calculate();
    });
  }

  ngOnInit(): void {

  }

  public calculate(): void {
    const totalMultiplier = this.mass * this.timeScale;
    console.log('multiplier', totalMultiplier);
    this.targetCalc = totalMultiplier * this.target;
    this.currentEstimateCalc = totalMultiplier * this.currentEstimate;
  }
}
