import { Injectable, Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { DictionaryType } from './dictionaryType.enum';
import { BaseApi } from '../_lib_code/api/baseApi.abstract';
import { GetDictionary } from '../_lib_code/api/getDictionary';
import { MapsHttpResponseHandler } from './mapsHttpResponseHandler';
import { MicronutrientDictionaryItem } from '../objects/dictionaries/micronutrientDictionaryItem';
import { Endpoint } from '../_lib_code/api/endpoint.abstract';
import { FoodGroupDictionaryItem } from '../objects/dictionaries/foodGroupDictionaryItem';
import { GetCurrentComposition } from './scenario/getCurrentComposition';
import { GetCurrentConsumption } from './scenario/getCurrentConsumption';
import { GetDietChangeFoodItem } from './scenario/getDietChangeFoodItem';
import { GetDietChangeConsumption } from './scenario/getDietChangeConsumption';
import { GetDietChangeComposition } from './scenario/getDietChangeComposition';
import { ImpactScenarioDictionaryItem } from '../objects/dictionaries/impactScenarioDictionaryItem';
import { GetTopFood } from './foodSystems/getTopFoods';
import { GetMicronutrientProjectionSources } from './projections/getMicronutrientProjectionSources';
import { GetProjectionSummaries } from './projections/getProjectionSummaries';
import { GetProjectionTotals } from './projections/getProjectionTotals';
import { AgeGenderDictionaryItem } from '../objects/dictionaries/ageGenderDictionaryItem';
import { GetFoodSystemsDataSources } from './foodSystems/getFoodSystemsDataSources';
import { GetBiomarkerDataSources } from './biomarker/getBiomarkerDataSources';
import { GetMicronutrientAvailability } from './foodSystems/getMicronutrientAvailability';
import { CountryDictionaryItem } from '../objects/dictionaries/countryDictionaryItem';
import { GetMonthlyFoodGroups } from './foodSystems/getMonthlyFoodGroups';
import { GetNationalSummary } from './foodSystems/getNationalSummary';
import { postFeedback } from './feedback/postFeedback';
import { GetMatchedTotals } from './foodSystems/getMatchedTotals';
import { InterventionsDictionaryItem } from '../objects/dictionaries/interventionDictionaryItem';
import { GetIntervention } from './intervention/intervention/getIntervention';
import { GetInterventionData } from './intervention/interventionData/getInterventionData';
import { GetInterventionFoodVehicleStandards } from './intervention/interventionFoodVehicleStandards/getInterventionFoodVehicleStandards';
import { GetInterventionIndustryInformation } from './intervention/interventionIndustryInformation/getInterventionIndustryInformation';
import { GetInterventionMonitoringInformation } from './intervention/interventionMonitoringInformation/getInterventionMonitoringInformation';
import { GetInterventionRecurringCosts } from './intervention/interventionRecurringCosts/getInterventionRecurringCosts';
import { GetInterventionStartupCosts } from './intervention/InterventionStartupCosts/getInterventionStartupCosts';
import { GetInterventionBaselineAssumptions } from './intervention/interventionBaselineAssumptions/getInterventionBaselineAssumptions';
import { GetInterventionCostSummary } from './intervention/interventionCostSummary/getInterventionCostSummary';
import { PostIntervention } from './intervention/intervention/postIntervention';
import { PatchInterventionData } from './intervention/interventionData/patchInterventionData';
import { GetApiMetadata } from './misc/getApiMetadata';
import { GetRegions } from './region/getRegions';
import { UserRegister } from './login/register';
import { UserLogin } from './login/login';
import { UserLogout } from './login/logout';
import { GetUserProfile } from './login/getUserProfile';
import { UserLoginService } from 'src/app/services/userLogin.service';
import { PatchIntervention } from './intervention/intervention/patchIntervention';

@Injectable()
export class ApiService extends BaseApi {
  // turn on mock data by setting this to false
  private static readonly USE_LIVE_API = environment.useLiveApi;

  public readonly endpoints = {
    diet: {
      getTopFoods: new GetTopFood(ApiService.USE_LIVE_API),
      getDataSources: new GetFoodSystemsDataSources(ApiService.USE_LIVE_API),
      getMicronutrientAvailability: new GetMicronutrientAvailability(ApiService.USE_LIVE_API),
      getMonthlyFoodGroups: new GetMonthlyFoodGroups(ApiService.USE_LIVE_API),
      getNationalSummary: new GetNationalSummary(ApiService.USE_LIVE_API),
      getMatchedTotals: new GetMatchedTotals(ApiService.USE_LIVE_API),
    },
    biomarker: {
      getDataSources: new GetBiomarkerDataSources(ApiService.USE_LIVE_API),
    },
    projections: {
      getMicronutrientProjectionSources: new GetMicronutrientProjectionSources(ApiService.USE_LIVE_API),
      getProjectionSummaries: new GetProjectionSummaries(ApiService.USE_LIVE_API),
      getProjectionTotals: new GetProjectionTotals(ApiService.USE_LIVE_API),
    },
    scenario: {
      getCurrentComposition: new GetCurrentComposition(ApiService.USE_LIVE_API),
      getCurrentConsumption: new GetCurrentConsumption(ApiService.USE_LIVE_API),
      getDietChangeComposition: new GetDietChangeComposition(ApiService.USE_LIVE_API),
      getDietChangeConsumption: new GetDietChangeConsumption(ApiService.USE_LIVE_API),
      getDietChangeFoodItem: new GetDietChangeFoodItem(ApiService.USE_LIVE_API),
    },
    intervention: {
      getIntervention: new GetIntervention(ApiService.USE_LIVE_API, this.userLoginService),
      getInterventionData: new GetInterventionData(ApiService.USE_LIVE_API),
      getInterventionFoodVehicleStandards: new GetInterventionFoodVehicleStandards(ApiService.USE_LIVE_API),
      getInterventionIndustryInformation: new GetInterventionIndustryInformation(ApiService.USE_LIVE_API),
      getInterventionMonitoringInformation: new GetInterventionMonitoringInformation(ApiService.USE_LIVE_API),
      getInterventionRecurringCosts: new GetInterventionRecurringCosts(ApiService.USE_LIVE_API),
      getInterventionStartupCosts: new GetInterventionStartupCosts(ApiService.USE_LIVE_API),
      getInterventionBaselineAssumptions: new GetInterventionBaselineAssumptions(ApiService.USE_LIVE_API),
      getInterventionCostSummary: new GetInterventionCostSummary(ApiService.USE_LIVE_API),
      postIntervention: new PostIntervention(ApiService.USE_LIVE_API),
      patchIntervention: new PatchIntervention(ApiService.USE_LIVE_API, this.userLoginService),
      patchInterventionData: new PatchInterventionData(ApiService.USE_LIVE_API),
    },
    misc: {
      postFeedback: new postFeedback(ApiService.USE_LIVE_API),
      getApiMetadata: new GetApiMetadata(ApiService.USE_LIVE_API),
    },
    region: {
      getRegions: new GetRegions(ApiService.USE_LIVE_API),
    },
    user: {
      getProfile: new GetUserProfile(ApiService.USE_LIVE_API),
      register: new UserRegister(ApiService.USE_LIVE_API),
      login: new UserLogin(ApiService.USE_LIVE_API),
      logout: new UserLogout(ApiService.USE_LIVE_API),
    },
  };

  private _dictionaries = [
    new GetDictionary(DictionaryType.COUNTRIES, ApiService.USE_LIVE_API)
      .setDefaultParams({
        path: 'countries',
        typeObj: CountryDictionaryItem,
      })
      .setMockObjectsCreatorFunc((injector) => CountryDictionaryItem.getMockItems(injector)),
    new GetDictionary(DictionaryType.REGIONS, false)
      .setDefaultParams({ path: 'regions', typeObj: CountryDictionaryItem })
      .setMockObjectsCreatorFunc((injector) => CountryDictionaryItem.getMockItems(injector)),
    new GetDictionary(DictionaryType.MICRONUTRIENTS, ApiService.USE_LIVE_API)
      .setDefaultParams({ path: 'micronutrients', typeObj: MicronutrientDictionaryItem })
      .setMockObjectsCreatorFunc((injector) => MicronutrientDictionaryItem.getMockItems(injector)),
    new GetDictionary(DictionaryType.FOOD_GROUPS, ApiService.USE_LIVE_API)
      .setDefaultParams({ path: 'food-groups', typeObj: FoodGroupDictionaryItem })
      .setMockObjectsCreatorFunc((injector) => FoodGroupDictionaryItem.getMockItems(injector)),
    new GetDictionary(DictionaryType.IMPACT_SCENARIOS, ApiService.USE_LIVE_API)
      .setDefaultParams({
        path: 'diet/projections/scenarios',
        typeObj: ImpactScenarioDictionaryItem,
      })
      .setMockObjectsCreatorFunc((injector) => ImpactScenarioDictionaryItem.getMockItems(injector)),
    new GetDictionary(DictionaryType.AGE_GENDER_GROUPS, ApiService.USE_LIVE_API)
      .setDefaultParams({
        path: 'biomarker/age-gender-groups',
        typeObj: AgeGenderDictionaryItem,
      })
      .setMockObjectsCreatorFunc((injector) => AgeGenderDictionaryItem.getMockItems(injector)),
    new GetDictionary(DictionaryType.INTERVENTIONS, ApiService.USE_LIVE_API, true).setDefaultParams({
      path: 'interventions',
      typeObj: InterventionsDictionaryItem,
    }),
  ];

  constructor(httpClient: HttpClient, injector: Injector, private readonly userLoginService: UserLoginService) {
    super(injector, httpClient, new MapsHttpResponseHandler(injector), environment.apiBaseUrl);

    this.addDictionaries(this._dictionaries);

    // add endpoints
    Object.values(this.endpoints).forEach((group: Record<string, Endpoint<unknown, unknown>>) => {
      this.addEndpoints(Object.values(group));
    });

    // this.addDefaultHeader('X-Parse-Application-Id', environment.parseAppName);

    // const tokenHeader = 'x-parse-session-token';
    // accountService.watchForLogin().subscribe(() => {
    //   const token = accountService.getAccessToken();
    //   this.addDefaultHeader(tokenHeader, token);
    // });

    // accountService.watchForLogout().subscribe(() => {
    //   this.removeDefaultHeader(tokenHeader);
    // });
  }
}
