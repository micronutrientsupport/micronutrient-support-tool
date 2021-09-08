/* eslint-disable @typescript-eslint/dot-notation */
import { ChangeDetectionStrategy, Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { QuickMapsService } from '../../../quickMaps.service';
import { DialogService } from 'src/app/components/dialogs/dialog.service';
import { DataLevel } from 'src/app/apiAndObjects/objects/enums/dataLevel.enum';

@Component({
  selector: 'app-base-desc',
  templateUrl: './baselineDescription.component.html',
  styleUrls: ['./baselineDescription.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BaselineDescriptionComponent implements OnInit {
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  public readonly DATA_LEVEL = DataLevel;
  public loading = false;
  public error = false;

  constructor(
    public quickMapsService: QuickMapsService,
    private cdr: ChangeDetectorRef,
    private dialogService: DialogService,
  ) {}

  ngOnInit(): void {}

  public openBaselineDescriptionDialog(): void {
    void this.dialogService.openBaselineDescriptionDialog();
  }
}
