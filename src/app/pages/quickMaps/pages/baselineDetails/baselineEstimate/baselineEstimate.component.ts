/* eslint-disable @typescript-eslint/dot-notation */
import { ChangeDetectionStrategy, Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Dictionary } from 'src/app/apiAndObjects/_lib_code/objects/dictionary';
import { QuickMapsService } from '../../../quickMaps.service';
import { DictionaryService } from 'src/app/services/dictionary.service';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-base-est',
  templateUrl: './baselineEstimate.component.html',
  styleUrls: ['./baselineEstimate.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BaslineEstimateComponent implements OnInit {
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  public countriesDictionary: Dictionary;
  public regionDictionary: Dictionary;
  public micronutrientsDictionary: Dictionary;
  public loading = false;
  public error = false;
  public countryName = '';
  public vitaminName = '';
  public projectionEstimateForm: FormGroup;

  constructor(
    public quickMapsService: QuickMapsService,
    private dictionaryService: DictionaryService,
    private cdr: ChangeDetectorRef,
    private fb: FormBuilder,
  ) {}

  ngOnInit(): void {
    this.projectionEstimateForm = this.fb.group({
      kg: null,
      nation: null,
      year: null,
    });
  }
}
