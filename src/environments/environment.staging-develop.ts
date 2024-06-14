import { environment as baseEnvironment } from './environment.base';

export const environment = {
  ...baseEnvironment,
  production: true,
  unleashUrl: 'https://feature-flags.micronutrient.support/',
  unleashSecret: 'proxy-key',
  unleashAppName: 'MAPS Tool',
  unleashEnvironment: 'staging-develop',
  apiBaseUrl: 'https://apidev.micronutrient.support/v2',
};
