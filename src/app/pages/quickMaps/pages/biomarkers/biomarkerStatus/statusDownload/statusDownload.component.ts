import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-status-download',
  templateUrl: './statusDownload.component.html',
  styleUrls: ['./statusDownload.component.scss'],
})
export class StatusDownloadComponent implements OnInit {
  public boxChartPNG: string;
  public boxChartPDF: string;
  public excessBarChartPNG: string;
  public excessBarChartPDF: string;
  public deficiencyBarChartPNG: string;
  public deficiencyBarChartPDF: string;
  public combinedBarChartPNG: string;
  public combinedBarChartPDF: string;

  constructor() {}

  ngOnInit(): void {}
}
