import { Component } from '@angular/core';
import { AppRoutes } from 'src/app/routes/routes';
import { DialogService } from '../dialogs/dialog.service';
import { UntypedFormGroup } from '@angular/forms';
import { ApiService } from 'src/app/apiAndObjects/api/api.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  public ROUTES = AppRoutes;
  public form!: UntypedFormGroup;

  constructor(private dialogService: DialogService, private apiService: ApiService) {}

  public handleLoginDialog(): void {
    this.dialogService.openLoginDialog();
  }

  public handleGetProfile() {
    this.apiService.endpoints.login.getProfile.call().then((response) => {
      console.debug(response);
    });
  }
}
