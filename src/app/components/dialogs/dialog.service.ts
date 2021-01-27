import { ComponentType } from '@angular/cdk/portal';
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ChartJSObject } from 'src/app/apiAndObjects/objects/misc/chartjsObject';
import { MatTableObject } from 'src/app/apiAndObjects/objects/misc/matTableObject';
import { BaseDialogService, DialogData } from './baseDialogService.abstract';
import { ExpandDialogComponent } from './expandDialog/expandDialog.component';
import { MapDialogComponent } from './mapDialog/mapDialog.component';
import { ShareDialogComponent } from './shareDialog/dialogShare.component';
@Injectable({
  providedIn: 'root',
})
export class DialogService extends BaseDialogService {
  constructor(public dialog: MatDialog) {
    super(dialog);
  }

  // should be renamed to openMapDialog;
  public openMapDialog(contentValue: string): Promise<DialogData> {
    return this.openDialog('mapDialog', MapDialogComponent, true, {
      content: contentValue,
    });
  }
  // eslint-disable-next-line @typescript-eslint/ban-types
  public openChartDialog(graphData: ChartJSObject, tableData?: MatTableObject): Promise<DialogData> {
    return this.openDialog('chartDialog', ExpandDialogComponent, true,
      {
        graphData,
        tableData
      });
  }
  public openShareDialog(shareLink: string): Promise<DialogData> {
    return this.openDialog('sharingDialog', ShareDialogComponent, true, { shareLink });
  }

  public openDialogForComponent(
    contentComponent: ComponentType<any>,
    width = '80vw',
    height = '80vh',
  ): Promise<DialogData> {
    return this.openDialog('anyDialog', contentComponent, true, null, {
      width,
      height,
    });
  }
}
