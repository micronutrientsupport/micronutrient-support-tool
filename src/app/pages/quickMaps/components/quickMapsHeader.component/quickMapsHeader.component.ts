import { Component } from '@angular/core';
import { AppRoutes } from 'src/app/routes/routes';

@Component({
  selector: 'app-quick-maps-header',
  templateUrl: './quickMapsHeader.component.html',
  styleUrls: ['./quickMapsHeader.component.scss'],
})
export class QuickMapsHeaderComponent {
  public ROUTES = AppRoutes;
  constructor() { }
}
