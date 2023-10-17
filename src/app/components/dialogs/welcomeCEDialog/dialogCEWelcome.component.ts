import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SafeResourceUrl } from '@angular/platform-browser';
import { TourService } from 'src/app/services/tour.service';
import { DialogData } from '../baseDialogService.abstract';

@Component({
  selector: 'app-dialog-ce-welcome',
  templateUrl: './dialogCEWelcome.component.html',
  styleUrls: ['./dialogCEWelcome.component.scss'],
})
export class WelcomeCEDialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: DialogData<unknown>, private tourService: TourService) {}
}
