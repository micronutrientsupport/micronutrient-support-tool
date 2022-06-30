// Sharing code from https://github.com/ShankyTiwari/ng-navigator-share
// which was a lightweight angular wrapper. This repo no longer was being updated
// to support Angular version 13
import { Injectable } from '@angular/core';
import { DialogService } from '../components/dialogs/dialog.service';

@Injectable()
export class SharingService {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  webNavigator: any = null;
  constructor(private modalService: DialogService) {
    this.webNavigator = window.navigator;
  }

  public doShare(text: string, title?: string, url?: string): Promise<unknown> {
    if (!this.canShare()) {
      console.log('This service/api is not supported in your Browser');
      return this.modalService.openShareDialog(window.location.href);
    }

    this.share({
      title,
      text,
      url,
    })
      .then((response) => {
        console.log(response);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  public canShare(): boolean {
    return this.webNavigator !== null && this.webNavigator.share !== undefined;
  }

  public canShareFile(file: []): boolean {
    return (
      this.webNavigator !== null && this.webNavigator.share !== undefined && this.webNavigator.canShare({ files: file })
    );
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
  public share({ title, text, url, files }: { title: string; text?: string; url?: string; files?: any[] }) {
    // eslint-disable-next-line no-async-promise-executor
    return new Promise(async (resolve, reject) => {
      if (this.webNavigator !== null && this.webNavigator.share !== undefined) {
        if ((text === undefined || text === null) && (url === undefined || url === null)) {
          console.warn(`text and url both can't be empty, at least provide either text or url`);
        } else {
          try {
            const shareObject: ShareObject = {
              title,
              text,
              url,
            };
            if (files && files.length !== 0) {
              shareObject.files = files;
            }
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const isShared = await this.webNavigator.share(shareObject);
            resolve({
              shared: true,
            });
          } catch (error) {
            reject({
              shared: false,
              error,
            });
          }
        }
      } else {
        reject({
          shared: false,
          error: `This service/api is not supported in your Browser`,
        });
      }
    });
  }
}

interface ShareObject {
  title: string;
  text: string;
  url: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  files?: any[];
}
