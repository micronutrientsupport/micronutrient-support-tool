import { Component } from '@angular/core';
import { AppRoutes } from 'src/app/routes/routes';

@Component({
  selector: 'app-footer-light',
  templateUrl: './footerLight.component.html',
  styleUrls: ['./footerLight.component.scss'],
})
export class FooterLightComponent {
  public ROUTES = AppRoutes;
}
