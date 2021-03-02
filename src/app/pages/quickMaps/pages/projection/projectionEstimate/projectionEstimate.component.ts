/* eslint-disable @typescript-eslint/dot-notation */
import { ChangeDetectionStrategy, Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { PopulationGroup } from 'src/app/apiAndObjects/objects/populationGroup';
import { Dictionary } from 'src/app/apiAndObjects/_lib_code/objects/dictionary';
import { QuickMapsService } from '../../../quickMaps.service';
import { DictionaryService } from 'src/app/services/dictionary.service';
import { FormBuilder, FormGroup } from '@angular/forms';

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
  public countryName = '';
  public vitaminName = '';
  public projectionEstimateForm: FormGroup;
  public massArray: [
    { id: '1', name: 'mcg' },
    { id: '2', name: 'mg' },
    { id: '3', name: 'g' },
    { id: '4', name: 'kg' },
    { id: '5', name: 'mg' },
  ];
  public timeScaleArray: [
    { id: '1', name: 'day' },
    { id: '2', name: 'week' },
    { id: '3', name: 'month' },
    { id: '4', name: 'year' },
  ];

  constructor(
    public quickMapsService: QuickMapsService,
    private dictionaryService: DictionaryService,
    private cdr: ChangeDetectorRef,
    private fb: FormBuilder,
  ) {
    this.projectionEstimateForm = this.fb.group({
      mass: '3',
      timeScale: '1',
    });
  }

  ngOnInit(): void {

  }
}