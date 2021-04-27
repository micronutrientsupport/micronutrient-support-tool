import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { QuickMapsService } from '../../../quickMaps.service';

@Component({
  selector: 'app-biomarker-overview',
  templateUrl: './biomarkerOverview.component.html',
  styleUrls: ['./biomarkerOverview.component.scss']
})
export class BiomarkerOverviewComponent implements OnInit {

  constructor(
    public quickMapsService: QuickMapsService,
    private cdr: ChangeDetectorRef,
  ) { }

  ngOnInit(): void {
  }

}
