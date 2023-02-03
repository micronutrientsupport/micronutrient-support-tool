import { environment as baseEnvironment } from './environment.base';

export const environment = {
  ...baseEnvironment,
  production: true,
  unleashUrl: 'https://feature-flags.micronutrient.support/',
  unleashSecret: 'proxy-key',
  unleashAppName: 'MAPS Tool',
  unleashEnvironment: 'preview',
  apiBaseUrl: 'https://api.micronutrient.support/v2',
  // apiBaseUrl: 'https://api.micronutrient.support/dev/v2',
};
