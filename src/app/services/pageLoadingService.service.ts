import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PageLoadingService {
  private isLoadingSrc = new BehaviorSubject<boolean>(false);
  // eslint-disable-next-line @typescript-eslint/member-ordering
  public isLoadingObs = this.isLoadingSrc.asObservable();

  private loadingCount = 0;

  public getIsLoading(): boolean {
    return this.isLoadingSrc.value;
  }

  public showLoading(show: boolean): void {
    if (show) {
      this.loadingCount++;
    } else {
      this.loadingCount--;
    }
    this.isLoadingSrc.next(0 < this.loadingCount);
  }

  public endLoading(): void {
    this.loadingCount = 0;
    this.isLoadingSrc.next(false);
  }
}
