import { environment as baseEnvironment } from './environment.base';

export const environment = {
  ...baseEnvironment,
  production: true,
  // apiBaseUrl: 'https://api.micronutrient.support',
  // useLiveApi: false,

  unleashUrl: 'https://feature-flags.micronutrient.support/',
  unleashSecret: 'proxy-key',
  unleashAppName: 'MAPS Tool',
  unleashEnvironment: 'production',
};
