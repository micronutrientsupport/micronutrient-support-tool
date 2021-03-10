import { Component } from '@angular/core';
import { AppRoutes } from 'src/app/routes/routes';
import { DialogService } from '../dialogs/dialog.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  public ROUTES = AppRoutes;

  constructor(
    private dialogService: DialogService,
  ) {
  }

  public openError(): void {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    this.dialogService.openInvalidParametersDialog();
  }
}
