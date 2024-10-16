import { AfterViewInit, ChangeDetectorRef, Component } from '@angular/core';
import { QuickMapsService } from '../../../quickMaps.service';
import { Biomarker } from 'src/app/apiAndObjects/objects/biomarker';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-biomarker-overview',
  templateUrl: './biomarkerOverview.component.html',
  styleUrls: ['./biomarkerOverview.component.scss'],
})
export class BiomarkerOverviewComponent implements AfterViewInit {
  public activeBiomarker: Biomarker;
  private subscriptions = new Array<Subscription>();
  public loading = false;

  constructor(public quickMapsService: QuickMapsService, private cdr: ChangeDetectorRef) {}

  ngAfterViewInit(): void {
    this.subscriptions.push(
      this.quickMapsService.biomarkerDataObs.subscribe((data: Biomarker) => {
        this.activeBiomarker = data;
        // this.activeBiomarker.totalThresholds;
      }),
    );

    this.quickMapsService.biomarkerDataUpdatingSrc.obs.subscribe((updating: boolean) => {
      this.loading = updating;
    });
  }

  public keys(object: object): Array<string> {
    if (object) {
      return Object.keys(object);
    }
  }
}
