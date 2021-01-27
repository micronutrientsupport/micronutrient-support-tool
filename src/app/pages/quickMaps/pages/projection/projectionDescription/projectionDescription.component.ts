/* eslint-disable @typescript-eslint/dot-notation */
import {
  ChangeDetectionStrategy,
  EventEmitter,
  Input,
  OnDestroy,
  Component,
  OnInit,
  ViewChild,
  ChangeDetectorRef,
} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { PopulationGroup } from 'src/app/apiAndObjects/objects/populationGroup';
import { Dictionary } from 'src/app/apiAndObjects/_lib_code/objects/dictionary';
import { Subscription } from 'rxjs';
import { GridsterItem } from 'angular-gridster2';
import { QuickMapsService } from '../../../quickMaps.service';
import { DictionaryType } from 'src/app/apiAndObjects/api/dictionaryType.enum';
import { DictionaryService } from 'src/app/services/dictionary.service';
import { MicronutrientType } from 'src/app/apiAndObjects/objects/enums/micronutrientType.enum';

@Component({
  selector: 'app-proj-desc',
  templateUrl: './projectionDescription.component.html',
  styleUrls: ['./projectionDescription.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectionDescriptionComponent implements OnInit, OnDestroy {
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @Input()
  widget;
  @Input()
  resizeEvent: EventEmitter<GridsterItem>;
  resizeSub: Subscription;

  public countriesDictionary: Dictionary;
  public regionDictionary: Dictionary;
  public micronutrientsDictionary: Dictionary;
  public popGroupOptions = new Array<PopulationGroup>();
  public loading = false;
  public error = false;
  public countryName = '';
  public vitaminName = '';

  constructor(
    public quickMapsService: QuickMapsService,
    private dictionaryService: DictionaryService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.resizeSub = this.resizeEvent.subscribe((widget) => {
      if (widget === this.widget) {
      }
    });

    void this.dictionaryService
      .getDictionaries([DictionaryType.COUNTRIES, DictionaryType.REGIONS, DictionaryType.MICRONUTRIENTS])
      .then((dicts: Array<Dictionary>) => {
        this.countriesDictionary = dicts.shift();
        this.regionDictionary = dicts.shift();
        this.micronutrientsDictionary = dicts.shift();

        this.quickMapsService.countryIdObs.subscribe((countryId: string) => {
          const country = this.countriesDictionary.getItem(countryId);
          this.countryName = null != country ? country.name : '';
          this.cdr.detectChanges();
        });
        this.quickMapsService.micronutrientIdObs.subscribe((mndsId: string) => {
          const mnds = this.micronutrientsDictionary.getItem(mndsId);
          this.vitaminName = null != mnds ? mnds.name : '';
          console.log(this.vitaminName);
          this.cdr.detectChanges();
        });
      });

    // void this.dictionaryService
    //   .getDictionaries([DictionaryType.COUNTRIES, DictionaryType.REGIONS])
    //   .then((dicts: Array<Dictionary>) => {
    //     const countriesDict = dicts.shift();
    //     this.quickMapsService.countryIdObs.subscribe((countryId: string) => {
    //       const country = countriesDict.getItem(countryId);
    //       this.countryName = null != country ? country.name : '';
    //       this.cdr.detectChanges();
    //     });
    //   });
    // void this.dictionaryService
    //   .getDictionaries([MicronutrientType.VITAMIN])
    //   .then((dicts: Array<Dictionary>) => {
    //     const countriesDict = dicts.shift();
    //     this.quickMapsService.countryIdObs.subscribe((countryId: string) => {
    //       const country = countriesDict.getItem(countryId);
    //       this.countryName = null != country ? country.name : '';
    //       this.cdr.detectChanges();
    //     });
    //   });
  }

  ngOnDestroy(): void {
    this.resizeSub.unsubscribe();
  }
}
