import { Component } from '@angular/core';
import { AppRoutes } from 'src/app/app-routes';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent {

  public ROUTES = AppRoutes;
}
