import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogData } from '../baseDialogService.abstract';
import { environment } from 'src/environments/environment';
import { ApiService } from 'src/app/apiAndObjects/api/api.service';
import { ApiMetadata } from 'src/app/apiAndObjects/objects/apiMetadata';

@Component({
  selector: 'app-api-metadata-dialog',
  templateUrl: './apiMetadataDialog.component.html',
  styleUrls: ['./apiMetadataDialog.component.scss'],
})
export class ApiMetadataDialogComponent {
  public copyLinkUrl: string;
  public dataVersions: ApiMetadata;
  public version = environment.version;
  constructor(@Inject(MAT_DIALOG_DATA) public data: DialogData, private apiService: ApiService) {}

  public async ngOnInit(): Promise<void> {
    this.dataVersions = await this.apiService.endpoints.misc.getApiMetadata.call();
    console.log(this.dataVersions);
    console.log(this.dataVersions.schemaVersion);
  }
}
