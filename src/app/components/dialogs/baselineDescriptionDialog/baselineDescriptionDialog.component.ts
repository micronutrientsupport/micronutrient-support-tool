import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Clipboard } from '@angular/cdk/clipboard';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { DialogData } from '../baseDialogService.abstract';
import { QuickMapsService } from 'src/app/pages/quickMaps/quickMaps.service';
import { FoodSystemsDataSource } from 'src/app/apiAndObjects/objects/foodSystemsDataSource';

@Component({
  selector: 'app-description-dialog',
  templateUrl: './baselineDescriptionDialog.component.html',
  styleUrls: ['./baselineDescriptionDialog.component.scss'],
})
export class BaselineDescriptionDialogComponent implements OnInit {
  public copyLinkUrl: string;

  public dataSource: FoodSystemsDataSource;
  public country: string;
  public micronutrient: string;
  public title = '';

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private clipboard: Clipboard,
    private snackbarService: SnackbarService,
    private quickMapsService: QuickMapsService,
  ) {}

  public ngOnInit(): void {
    this.dataSource = this.quickMapsService.FoodSystemsDataSource.get();
    this.country = this.quickMapsService.country.get().name;
    this.micronutrient = this.quickMapsService.micronutrient.get().name;
    this.title = 'Dietary supply of ' + this.micronutrient + ' in ' + this.country + ': Dataset Details';
  }

  public copyLink(): void {
    this.clipboard.copy(this.copyLinkUrl);
    this.snackbarService.openSnackBar('Link copied: ' + this.copyLinkUrl, 'close');
  }
}
