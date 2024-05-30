import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { QuickMapsService } from 'src/app/pages/quickMaps/quickMaps.service';
import { AppRoutes } from 'src/app/routes/routes';
import { InterventionDataService, InterventionForm } from 'src/app/services/interventionData.service';
import { InterventionSideNavContentService } from '../../components/interventionSideNavContent/interventionSideNavContent.service';
import { Intervention } from 'src/app/apiAndObjects/objects/intervention';
import { MatTableDataSource } from '@angular/material/table';
import { InterventionIntakeThreshold } from 'src/app/apiAndObjects/objects/interventionIntakeThreshold';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';

@Component({
  selector: 'app-intervention-effectiveness-metrics',
  templateUrl: './interventionEffectivenessMetrics.component.html',
  styleUrls: ['./interventionEffectivenessMetrics.component.scss'],
})
export class InterventionEffectivenessMetricsComponent implements OnInit {
  public displayedColumns: string[] = ['threshold', 'units', 'source'];

  public loading = false;
  public dataLoaded = false;

  public form: UntypedFormGroup;
  public formChanges: InterventionForm['formChanges'] = {};

  public baseYear = 2021;
  public dataSource = new MatTableDataSource();
  public data;

  public ROUTES = AppRoutes;
  public pageStepperPosition = 7;

  private subscriptions = new Array<Subscription>();

  constructor(
    public quickMapsService: QuickMapsService,
    private intSideNavService: InterventionSideNavContentService,
    private interventionDataService: InterventionDataService,
    private formBuilder: UntypedFormBuilder,
  ) {}

  public ngOnInit(): void {
    this.intSideNavService.setCurrentStepperPosition(this.pageStepperPosition);
    const activeInterventionId = this.interventionDataService.getActiveInterventionId();
    if (null != activeInterventionId) {
      void this.interventionDataService
        .getInterventionIntakeThreshold(activeInterventionId)
        .then((data: InterventionIntakeThreshold[]) => {
          console.log(data);

          const nr: Array<{
            title: string;
            threshold: number;
            thresholdDefault?: number;
            units: string;
            source: string;
            ear?: number;
            energy?: number;
            ul?: number;
            cnd?: number;
            cul?: number;
            field?: string;
          }> = [
            {
              title: 'Nutrient Requirement',
              threshold: data[0].ear,
              thresholdDefault: data[0].earDefault,
              units: `${data[0].unitAdequacy}/day`,
              source: data[0].source,
              ear: data[0].ear,
              field: 'ear',
            },
            {
              title: 'Energy Requirement',
              threshold: data[0].energy,
              thresholdDefault: data[0].energyDefault,
              units: 'kcal/day',
              source: 'FAO/WHO human energy requirement',
              energy: data[0].energy,
              field: 'energy',
            },
            {
              title: 'Critical Nutrient Density',
              threshold: (data[0].ear / data[0].energy) * 1000,
              units: `${data[0].unitCnd}/day`,
              source: 'Calculation',
            },
            {
              title: 'Tolerable Upper Intake Level',
              threshold: data[0].ul,
              thresholdDefault: data[0].ulDefault,
              units: `${data[0].unitExcess}/day`,
              source: data[0].source,
              ul: data[0].ul,
              field: 'ul',
            },
            {
              title: 'Critical upper level',
              threshold: data[0].cul,
              units: `${data[0].unitCnd}/day`,
              source: 'Calculation',
            },
          ];

          console.log(nr);

          this.dataSource = new MatTableDataSource(nr);
          this.data = nr;

          const fields = [
            this.formBuilder.group({
              rowIndex: 'thresholds',
              rowUnits: 'number',
              ear: [data[0].ear, []],
              ul: [data[0].ul, []],
              energy: [data[0].energy, []],
              isCalculated: [false, []],
            }),
          ];
          this.form = this.formBuilder.group({
            items: this.formBuilder.array(fields),
          });

          this.interventionDataService.initFormChangeWatcher(this.form, this.formChanges);

          this.dataLoaded = true;
          console.log(data);
          console.log(this.dataSource);
          console.log(this.form);
        });
    }
  }

  public updateField(index: number, field: string) {
    return ($event: Event) => {
      // Update
      this.data[index][field] = Number(($event.target as any).value);

      console.log(this.data);

      // Recalc CND and CUL
      this.dataSource.data[2]['threshold'] = (this.data[0].ear / this.data[1].energy) * 1000;
      this.dataSource.data[4]['threshold'] = (this.data[3].ul / this.data[1].energy) * 1000;

      console.log(this.dataSource.data);
    };
  }

  public resetForm() {
    console.log('TODO');
    this.dataSource.data[0]['threshold'] = this.data[0].thresholdDefault;
    this.dataSource.data[1]['threshold'] = this.data[1].thresholdDefault;
    this.dataSource.data[3]['threshold'] = this.data[3].thresholdDefault;

    this.form.controls.items['controls'][0].controls['ear'].setValue(this.data[0].thresholdDefault);
    this.form.controls.items['controls'][0].controls['energy'].setValue(this.data[1].thresholdDefault);
    this.form.controls.items['controls'][0].controls['ul'].setValue(this.data[3].thresholdDefault);

    console.log(this.dataSource.data);
  }

  public confirmAndContinue(): void {
    this.interventionDataService.interventionPageConfirmContinue();
  }
}
