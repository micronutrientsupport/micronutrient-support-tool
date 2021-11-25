import { Component } from '@angular/core';
import { AppRoutes } from 'src/app/routes/routes';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-footer-light',
  templateUrl: './footerLight.component.html',
  styleUrls: ['./footerLight.component.scss'],
})
export class FooterLightComponent {
  public ROUTES = AppRoutes;
  public version = environment.version;
}
