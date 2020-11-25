import { ComponentType } from '@angular/cdk/portal';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';

export abstract class BaseDialogService {
  private lastParentElement: HTMLElement;
  private customBackdrop: HTMLElement;

  constructor(public dialog: MatDialog) {
    this.customBackdrop = document.createElement('div');
    this.customBackdrop.classList.add('dialog-custom-backdrop');
  }

  protected makeDialogData(id: string, dataInput = {}): DialogData {
    const data = {
      requiresRefreshOnClose: false,
      close: () => {
        const dialogRef = this.dialog.getDialogById(id);
        if (null == dialogRef) {
          console.log(`Attempt to close non-existent dialog with id "${id}."`);
        } else {
          dialogRef.close(data);
        }
      },
      dataIn: dataInput,
      dataOut: {},
    };
    return data;
  }

  protected openDialog(
    dialogId: string,
    contentComponent: ComponentType<any>,
    customData = {},
    configIn: MatDialogConfig = {},
    parentElement?: HTMLElement,
  ): Promise<DialogData> {
    // don't open if already open
    let dialogRef = this.dialog.getDialogById(dialogId);
    if (null != dialogRef) {
      return Promise.reject();
    } else {
      const dialogData = this.makeDialogData(dialogId, customData);
      this.lastParentElement = parentElement;

      const config = {
        minHeight: 150,
        panelClass: 'maps-dialog',
        data: dialogData,
        id: dialogId,
        hasBackdrop: this.lastParentElement == null,
        ...configIn,
      };

      if (this.dialog.openDialogs.length === 0) {
        this.addCustomBackdrop();
      }
      dialogRef = this.dialog.open(contentComponent, config);

      void dialogRef
        .afterClosed()
        .toPromise()
        .then(() => this.tryRemoveCustomBackdrop());
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return dialogRef.afterClosed().toPromise();
    }
  }

  protected addCustomBackdrop(): void {
    if (this.lastParentElement != null) {
      this.lastParentElement.classList.add('dialog-custom-backdrop-wrapper');
      this.lastParentElement.appendChild(this.customBackdrop);
    }
  }
  protected tryRemoveCustomBackdrop(): void {
    if (this.dialog.openDialogs.length === 0) {
      const parent = this.customBackdrop.parentElement;
      if (parent != null) {
        parent.classList.remove('dialog-custom-backdrop-wrapper');
        parent.removeChild(this.customBackdrop);
      }
    }
  }
}

export interface DialogData<DataInType = any, DataOutType = any> {
  requiresRefreshOnClose: boolean;
  // eslint-disable-next-line @typescript-eslint/ban-types
  close: (moreData?: object) => void;
  dataIn: DataInType;
  dataOut: DataOutType;
}
