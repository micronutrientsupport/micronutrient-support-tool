import { Component, OnInit } from '@angular/core';
import { QuickMapsService } from '../../quickMaps.service';

@Component({
  selector: 'app-baseline-details',
  templateUrl: './baselineDetails.component.html',
  styleUrls: ['./baselineDetails.component.scss'],
})
export class BaselineDetailsComponent implements OnInit {
  constructor(
    public quickmapsService: QuickMapsService,
  ) { }
  ngOnInit(): void { }
}
