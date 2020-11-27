
import { Component, OnInit } from '@angular/core';
import { QuickMapsService } from './quickMaps.service';

@Component({
  selector: 'app-quickmaps',
  templateUrl: './quickMaps.component.html',
  styleUrls: ['./quickMaps.component.scss'],
})
export class QuickMapsComponent implements OnInit {

  constructor(public quickMapsService: QuickMapsService) {
  }
  ngOnInit(): void {
  }

}
