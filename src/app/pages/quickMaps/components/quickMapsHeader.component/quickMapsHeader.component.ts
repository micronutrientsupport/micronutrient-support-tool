/* eslint-disable @typescript-eslint/dot-notation */
import { ActivatedRoute } from '@angular/router';
import { AppRoutes } from 'src/app/routes/routes';
import { Component } from '@angular/core';
import { QuickMapsService } from '../../quickMaps.service';
@Component({
  selector: 'app-quick-maps-header',
  templateUrl: './quickMapsHeader.component.html',
  styleUrls: ['./quickMapsHeader.component.scss'],
})
export class QuickMapsHeaderComponent {
  public ROUTES = AppRoutes;
  constructor(public route: ActivatedRoute, public quickMapsService: QuickMapsService) {}
}
