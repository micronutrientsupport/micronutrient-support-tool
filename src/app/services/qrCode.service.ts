import { Injectable } from '@angular/core';
import { toDataURL, toString } from 'qrcode';
import { toSJIS } from 'qrcode/helper/to-sjis';

type Color = {
  dark: string;
  light: string;
};

interface QROpts {
  margin?: number;
  width?: number;
  errorCorrectionLevel?: string;
  color?: Color;
  type?: string;
}

@Injectable()
export class QrCodeService {
  public renderQR(format: string, mode: string | null, qrData: string, qrOpts: QROpts) {
    if (mode === 'sjis') {
      return new Promise((resolve, reject) => {
        toDataURL(qrData, { toSJISFunc: toSJIS }, (err, url) => {
          if (err) {
            reject(new Error(`Could not generate QR\n${err}`));
          }
          resolve(url);
        });
      });
    }

    qrOpts.type = format === 'png' ? 'png' : 'svg';
    return new Promise((resolve, reject) => {
      if (format === 'svg') {
        toString(qrData, qrOpts, (err, string) => {
          if (err) {
            reject(new Error(`Could not generate QR\n${err}`));
          }
          resolve(string);
        });
      } else {
        toDataURL(qrData, qrOpts, (err, url) => {
          if (err) {
            reject(new Error(`Could not generate QR\n${err}`));
          }
          resolve(url);
        });
      }
    });
  }
}
