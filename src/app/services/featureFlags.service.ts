import { Injectable } from '@angular/core';
import { UnleashClient } from 'unleash-proxy-client';
import { environment } from 'src/environments/environment.base';

@Injectable({ providedIn: 'root' })
export class FeatureFlagsService {
  private unleashClient: UnleashClient;

  constructor() {
    console.log('Connecting to unleash');
    this.unleashClient = new UnleashClient({
      url: environment.unleashUrl + environment.unleashEnvironment,
      clientKey: environment.unleashSecret,
      appName: environment.unleashAppName,
      environment: environment.unleashEnvironment,
    });
  }

  public isDisabled(flag: string): boolean {
    return !this.unleashClient.isEnabled(flag);
  }

  public isEnabled(flag: string): boolean {
    return this.unleashClient.isEnabled(flag);
  }

  public getFlagContent(flag: string): Record<string, unknown> | string | boolean {
    const variant = this.unleashClient.getVariant(flag);
    if (variant && variant.payload) {
      let value: Record<string, unknown> | string = variant.payload.value;
      if (variant.payload?.type === 'json') {
        value = JSON.parse(variant.payload.value) as Record<string, unknown>;
      }
      return value;
    } else {
      return false;
    }
  }

  async loadFlags(): Promise<void> {
    return await this.unleashClient.start();
  }
}
