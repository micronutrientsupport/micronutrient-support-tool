import { Component } from '@angular/core';
import { AppRoutes } from 'src/app/routes/routes';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  public ROUTES = AppRoutes;
}
