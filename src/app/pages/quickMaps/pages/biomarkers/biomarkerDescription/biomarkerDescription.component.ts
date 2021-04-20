import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { QuickMapsService } from '../../../quickMaps.service';

@Component({
  selector: 'app-biomarker-description',
  templateUrl: './biomarkerDescription.component.html',
  styleUrls: ['./biomarkerDescription.component.scss']
})
export class BiomarkerDescriptionComponent implements OnInit {

  constructor(
    public quickMapsService: QuickMapsService,
    private cdr: ChangeDetectorRef,
  ) { }

  ngOnInit(): void {
  }

}
