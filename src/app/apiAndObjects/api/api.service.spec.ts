/* eslint-disable space-before-function-paren */
/* eslint-disable prefer-arrow/prefer-arrow-functions */
// import { inject, TestBed, waitForAsync } from '@angular/core/testing';
// import { HttpClientModule } from '@angular/common/http';
// import { ApiService } from './api.service';

import { HttpClientModule } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { NotificationsService } from 'src/app/components/notifications/notification.service';
import { ApiService } from './api.service';

describe('ApiService', () => {
  let apiService: ApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule, MatSnackBarModule],
      // declarations: [],
      providers: [NotificationsService, ApiService],
    });

    apiService = TestBed.inject(ApiService);
    // }),
  });

  // it('should be created', inject([ApiService], (service: ApiService) => {
  it('should be created', () => {
    // apiService
    // cy.wrap(apiService).should('not.be.null');
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    // expect(apiService).toBeTruthy();
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    // expect(apiService).toBe();

    // it('should create the service', () => {
    expect(apiService).not.to.be(null);
    // });

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
});

// describe('Unit Test Application Code', function () {
//   // const { add, divide, multiply, subtract } = math;
//   // const injector = Injector.create([
//   //   HttpClient,
//   // ] as Array<StaticProvider>);

//   before(() => {
//     // check if the import worked correctly
//     // expect(add, 'add').to.be.a('function');

//     waitForAsync(() => {
//       TestBed.configureTestingModule({
//         imports: [HttpClientModule],
//         // declarations: [],
//         providers: [ApiService],
//       });

//       // apiService = TestBed.inject(ApiService);
//     });
//   });

//   it('should be created', inject([ApiService], (service: ApiService) => {
//     // cy.wrap(service).should('not.be.null');
//     expect(service).toBeTruthy();
//   }));

//   // context('math.js', function () {
//   //   it('can add numbers', function () {
//   //     expect(add(1, 2)).to.eq(3);
//   //   });

//   //   it('can subtract numbers', function () {
//   //     expect(subtract(5, 12)).to.eq(-7);
//   //   });

//   //   it('can divide numbers', function () {
//   //     expect(divide(27, 9)).to.eq(3);
//   //   });

//   //   it('can muliple numbers', function () {
//   //     expect(multiply(5, 4)).to.eq(20);
//   //   });
//   // });
// });
