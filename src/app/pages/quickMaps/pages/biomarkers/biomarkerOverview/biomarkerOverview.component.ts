import { AfterViewInit, ChangeDetectorRef, Component } from '@angular/core';
import { QuickMapsService } from '../../../quickMaps.service';
import { Biomarker } from 'src/app/apiAndObjects/objects/biomaker';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-biomarker-overview',
  templateUrl: './biomarkerOverview.component.html',
  styleUrls: ['./biomarkerOverview.component.scss'],
})
export class BiomarkerOverviewComponent implements AfterViewInit {
  public activeBiomarker: Biomarker;
  private subscriptions = new Array<Subscription>();

  constructor(public quickMapsService: QuickMapsService, private cdr: ChangeDetectorRef) {}

  ngAfterViewInit(): void {
    this.subscriptions.push(
      this.quickMapsService.biomarkerDataObs.subscribe((data: Biomarker) => {
        this.activeBiomarker = data;

        this.activeBiomarker.totalThresholds;
      }),
    );
  }

  public keys(object: object): Array<string> {
    return Object.keys(object);
  }
}
