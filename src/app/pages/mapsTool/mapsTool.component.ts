import { Component } from '@angular/core';
import { AppRoutes } from 'src/app/app-routes';

@Component({
  selector: 'app-maps-tool',
  templateUrl: './mapsTool.component.html',
  styleUrls: ['./mapsTool.component.scss'],
})
export class MapsToolComponent {
  public ROUTES = AppRoutes;


}
