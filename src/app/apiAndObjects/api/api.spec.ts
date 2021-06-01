/* eslint-disable @typescript-eslint/no-floating-promises */
import { TestBed, waitForAsync } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { ApiService } from './api.service';

describe('ApiService', () => {
  let apiService: ApiService;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientModule],
        declarations: [],
        providers: [],
      });

      apiService = TestBed.inject(ApiService);
    }),
  );

  it('should create the service', () => {
    expect(apiService).to.not.be(null);
  });

  // it(`should have as title 'lims-gui'`, () => {
  //   const fixture = TestBed.createComponent(AppComponent);
  //   const app = fixture.debugElement.componentInstance;
  //   expect(app.title).toEqual('lims-gui');
  // });

  // it('should render title', () => {
  //   const fixture = TestBed.createComponent(AppComponent);
  //   fixture.detectChanges();
  //   const compiled = fixture.debugElement.nativeElement;
  //   expect(compiled.querySelector('.content span').textContent).toContain('lims-gui app is running!');
  // });
});
