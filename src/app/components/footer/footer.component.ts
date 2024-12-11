import { Component } from '@angular/core';
import { AppRoutes } from 'src/app/routes/routes';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
})
export class FooterComponent {
  public ROUTES = AppRoutes;

  public currentYear: number;
  constructor() {
    this.currentYear = new Date().getFullYear();
  }
}
