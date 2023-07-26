import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { ExportService } from 'src/app/services/export.service';
import { Clipboard } from '@angular/cdk/clipboard';
import { Exportable } from 'src/app/apiAndObjects/objects/exportable.interface';
import { MapDownloadService } from 'src/app/services/mapDownload.service';
import { jsPDF } from 'jspdf';
import { QrCodeService } from 'src/app/services/qrCode.service';

@Component({
  selector: 'app-download',
  templateUrl: './download.component.html',
  styleUrls: ['../../pages/expandableTabGroup.scss', './download.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DownloadComponent {
  @Input() chartDownloadPNG: string;
  @Input() chartDownloadPDF: string;
  @Input() dataArray: Array<Exportable>;

  private openImgHolder: Window;
  private qrOpts = {
    margin: 10,
    width: 150,
    errorCorrectionLevel: 'M',
    color: {
      dark: '703aa3',
      light: 'fff',
    },
  };
  private finalImg!: string;
  public year = new Date().getFullYear();
  public date = new Date();
  public formattedDate = this.date
    .toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    })
    .replace(/ /g, ' ');

  public copyPlainText =
    'MAPS' +
    `(${this.year})` +
    ' The Micronutrient Action Policy Support (MAPS) Tool project. https://tool.micronutrient.support/ Accessed: ' +
    `${this.formattedDate}`;

  public copyBibTex =
    '@misc{MAPS' +
    `(${this.year})` +
    '\n' +
    'author = {{The Micronutrient Action Policy Support (MAPS) Tool project}},' +
    '\n' +
    'title = {The Micronutrient Action Policy Support (MAPS) Tool project},' +
    '\n' +
    'year = {2021},' +
    '\n' +
    'note = {[Online; accessed ' +
    `${this.formattedDate}` +
    ']},' +
    '\n' +
    'url = {https://tool.micronutrient.support/}' +
    '\n' +
    '}';

  constructor(
    private clipboard: Clipboard,
    private exportService: ExportService,
    private mapDownloadService: MapDownloadService,
    private qrCodeService: QrCodeService,
  ) {}

  private makePDF(base64Img: string): void {
    const doc = new jsPDF({
      orientation: 'l',
      unit: 'pt',
      format: 'a4',
    });
    const width = doc.internal.pageSize.getWidth();
    const height = doc.internal.pageSize.getHeight();

    doc.addImage(base64Img, 'JPEG', 0, 0, width, height);
    doc.save('maps-chart.pdf');
  }

  private getImg(image: string): Promise<unknown> {
    const promise = new Promise((resolve) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.src = image;
    });
    return promise;
  }

  private addWatermarking(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, img: HTMLImageElement): void {
    ctx.drawImage(img, 0, 0, img.width, img.height);
    ctx.fillStyle = '#703aa3';
    ctx.fillRect(0, img.height + 20, img.width, 60);

    ctx.font = '23px Arial';
    ctx.fillStyle = '#FFFFFF';
    ctx.fillText('www.micronutrient.support', 180, img.height + 58);

    Promise.all([
      this.getImg('/assets/images/watermark.png'),
      this.qrCodeService.renderQR('png', null, 'https://micronutrient.support', this.qrOpts),
    ])
      .then((values) => {
        const watermark = values[0] as HTMLImageElement;
        const qrCodeUrl = values[1] as string;

        if (watermark && qrCodeUrl) {
          ctx.drawImage(watermark, 10, img.height + 28, 149, 45);

          this.getImg(qrCodeUrl).then((qrCode) => {
            ctx.drawImage(qrCode as HTMLImageElement, img.width - 80, img.height + 80 - 80, 80, 80);
            ctx.rect(img.width - 80 - 2, img.height + 80 - 80 - 2, 84, 84);
            ctx.lineWidth = 4;
            ctx.strokeStyle = '#703aa3';
            ctx.stroke();

            const imgStr = canvas.toDataURL('image/png');
            this.finalImg = imgStr;
            const finalImg = new Image();
            finalImg.src = imgStr;
            this.openImgHolder.document.write(finalImg.outerHTML);
          });
        }
      })
      .catch(function (err) {
        console.error(err.message);
      });
  }

  private drawCanvas(base64Img: string) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    this.getImg(base64Img).then((img: HTMLImageElement) => {
      canvas.width = img.width;
      canvas.height = img.height + 75;

      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      this.addWatermarking(canvas, ctx, img);
    });
  }

  public exportToCsv(): void {
    this.exportService.exportToCsv(this.dataArray);
  }

  public handleSavePDF(): void {
    this.drawCanvas(this.chartDownloadPNG);
    this.makePDF(this.finalImg);
  }

  public handleSavePNG(): void {
    this.openImgHolder = window.open('about:blank');
    this.drawCanvas(this.chartDownloadPNG);
  }
}
