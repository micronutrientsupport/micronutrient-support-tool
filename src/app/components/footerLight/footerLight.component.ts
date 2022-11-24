import { Component } from '@angular/core';
import { AppRoutes } from 'src/app/routes/routes';
import { environment } from 'src/environments/environment';
import { DialogService } from '../dialogs/dialog.service';

@Component({
  selector: 'app-footer-light',
  templateUrl: './footerLight.component.html',
  styleUrls: ['./footerLight.component.scss'],
})
export class FooterLightComponent {
  public ROUTES = AppRoutes;
  public version = environment.version;
  public currentYear: number;
  constructor(private readonly dialogService: DialogService) {
    this.currentYear = new Date().getFullYear();
  }

  openApiMetadataDialog() {
    this.dialogService.openApiMetadataDialog();
  }
}
