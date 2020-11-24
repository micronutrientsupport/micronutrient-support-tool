import { Component } from '@angular/core';
import { AppRoutes } from 'src/app/routes/routes';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  public ROUTES = AppRoutes;
}
