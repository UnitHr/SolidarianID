/**
 * @file This module exports various ODS-related data and functions.
 * @module common/ods
 *
 * @description This module provides a collection of ODS-related data and functions
 * to work with the Sustainable Development Goals (ODS).
 */

export enum ODSEnum {
  NoPoverty = 1,
  ZeroHunger = 2,
  GoodHealthAndWellBeing = 3,
  QualityEducation = 4,
  GenderEquality = 5,
  CleanWaterAndSanitation = 6,
  AffordableAndCleanEnergy = 7,
  DecentWorkAndEconomicGrowth = 8,
  IndustryInnovationAndInfrastructure = 9,
  ReducedInequalities = 10,
  SustainableCitiesAndCommunities = 11,
  ResponsibleConsumptionAndProduction = 12,
  ClimateAction = 13,
  LifeBelowWater = 14,
  LifeOnLand = 15,
  PeaceJusticeAndStrongInstitutions = 16,
  PartnershipsForTheGoals = 17,
}

export type ODSDetail = { id: ODSEnum; title: string; description: string };

export const odsData: Record<ODSEnum, ODSDetail> = {
  [ODSEnum.NoPoverty]: {
    id: ODSEnum.NoPoverty,
    title: 'No Poverty',
    description: 'Eradicate poverty in all its forms everywhere.',
  },
  [ODSEnum.ZeroHunger]: {
    id: ODSEnum.ZeroHunger,
    title: 'Zero Hunger',
    description: 'End hunger, achieve food security, and improve nutrition.',
  },
  [ODSEnum.GoodHealthAndWellBeing]: {
    id: ODSEnum.GoodHealthAndWellBeing,
    title: 'Good Health and Well-Being',
    description: 'Ensure healthy lives and promote well-being for all.',
  },
  [ODSEnum.QualityEducation]: {
    id: ODSEnum.QualityEducation,
    title: 'Quality Education',
    description: 'Ensure inclusive, equitable, and quality education.',
  },
  [ODSEnum.GenderEquality]: {
    id: ODSEnum.GenderEquality,
    title: 'Gender Equality',
    description: 'Achieve gender equality and empower all women and girls.',
  },
  [ODSEnum.CleanWaterAndSanitation]: {
    id: ODSEnum.CleanWaterAndSanitation,
    title: 'Clean Water and Sanitation',
    description:
      'Ensure availability and sustainable management of water and sanitation.',
  },
  [ODSEnum.AffordableAndCleanEnergy]: {
    id: ODSEnum.AffordableAndCleanEnergy,
    title: 'Affordable and Clean Energy',
    description:
      'Ensure access to affordable, reliable, and sustainable energy.',
  },
  [ODSEnum.DecentWorkAndEconomicGrowth]: {
    id: ODSEnum.DecentWorkAndEconomicGrowth,
    title: 'Decent Work and Economic Growth',
    description:
      'Promote sustained, inclusive, and sustainable economic growth.',
  },
  [ODSEnum.IndustryInnovationAndInfrastructure]: {
    id: ODSEnum.IndustryInnovationAndInfrastructure,
    title: 'Industry, Innovation, and Infrastructure',
    description:
      'Build resilient infrastructure and promote inclusive industrialization.',
  },
  [ODSEnum.ReducedInequalities]: {
    id: ODSEnum.ReducedInequalities,
    title: 'Reduced Inequalities',
    description: 'Reduce inequality within and among countries.',
  },
  [ODSEnum.SustainableCitiesAndCommunities]: {
    id: ODSEnum.SustainableCitiesAndCommunities,
    title: 'Sustainable Cities and Communities',
    description: 'Make cities and human settlements inclusive and sustainable.',
  },
  [ODSEnum.ResponsibleConsumptionAndProduction]: {
    id: ODSEnum.ResponsibleConsumptionAndProduction,
    title: 'Responsible Consumption and Production',
    description: 'Ensure sustainable consumption and production patterns.',
  },
  [ODSEnum.ClimateAction]: {
    id: ODSEnum.ClimateAction,
    title: 'Climate Action',
    description: 'Take urgent action to combat climate change and its impacts.',
  },
  [ODSEnum.LifeBelowWater]: {
    id: ODSEnum.LifeBelowWater,
    title: 'Life Below Water',
    description:
      'Conserve and sustainably use the oceans, seas, and marine resources.',
  },
  [ODSEnum.LifeOnLand]: {
    id: ODSEnum.LifeOnLand,
    title: 'Life on Land',
    description: 'Sustainably manage forests and halt biodiversity loss.',
  },
  [ODSEnum.PeaceJusticeAndStrongInstitutions]: {
    id: ODSEnum.PeaceJusticeAndStrongInstitutions,
    title: 'Peace, Justice, and Strong Institutions',
    description:
      'Promote peaceful and inclusive societies for sustainable development.',
  },
  [ODSEnum.PartnershipsForTheGoals]: {
    id: ODSEnum.PartnershipsForTheGoals,
    title: 'Partnerships for the Goals',
    description:
      'Strengthen the means of implementation and revitalize the global partnership.',
  },
};

export function mapODSEnumToDetails(ods: ODSEnum): ODSDetail {
  return {
    id: ods,
    title: odsData[ods]?.title || 'Unknown',
    description: odsData[ods]?.description || 'Description not available',
  };
}

export function mapODSEnumListToDetails(odsList: ODSEnum[]): ODSDetail[] {
  return odsList.map(mapODSEnumToDetails);
}
