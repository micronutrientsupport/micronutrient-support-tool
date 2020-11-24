import { Injectable } from '@angular/core';
import { NgNavigatorShareService } from 'ng-navigator-share';

@Injectable()
export class SharingService {
  constructor(private ngNavigatorShareService: NgNavigatorShareService) {}

  public async shareApi(title: string, text?: string, url?: string): Promise<any> {
    try {
      const sharedResponse = await this.ngNavigatorShareService.share({
        title,
        text,
        url,
      });
      console.log(sharedResponse);
      return sharedResponse;
    } catch (error) {
      console.log('You app is not shared, reason: ', error);
      return;
    }
  }
}
