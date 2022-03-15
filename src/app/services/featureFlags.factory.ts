import { FeatureFlagsService } from './featureFlags.service';

export class FeatureFlagsFactory {
  public static preloadFeatureFlags = (featureFlagService: FeatureFlagsService) => (): Promise<void> =>
    featureFlagService.loadFlags();
}
