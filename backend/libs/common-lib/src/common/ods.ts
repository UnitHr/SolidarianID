/**
 * @file This module exports various ODS-related data and functions.
 * @module common/ods
 *
 * @description This module provides a collection of ODS-related data and functions
 * to work with the Sustainable Development Goals (ODS).
 */

export enum ODSEnum {
  FinDeLaPobreza = 1,
  HambreCero = 2,
  SaludYBienestar = 3,
  EducacionDeCalidad = 4,
  IgualdadDeGenero = 5,
  AguaLimpiaYSaneamiento = 6,
  EnergiaAsequibleYNoContaminante = 7,
  TrabajoDecenteYCrecimientoEconomico = 8,
  IndustriaInnovacionEInfraestructura = 9,
  ReduccionDeLasDesigualdades = 10,
  CiudadesYComunidadesSostenibles = 11,
  ProduccionYConsumoResponsables = 12,
  AccionPorElClima = 13,
  VidaSubmarina = 14,
  VidaDeEcosistemasTerrestres = 15,
  PazJusticiaEInstitucionesSolidas = 16,
  AlianzasParaLograrLosObjetivos = 17,
}

export type ODSDetail = { id: ODSEnum; title: string; description: string };

export const odsData: Record<ODSEnum, ODSDetail> = {
  [ODSEnum.FinDeLaPobreza]: {
    id: ODSEnum.FinDeLaPobreza,
    title: 'Fin de la Pobreza',
    description: 'Erradicar la pobreza en todas sus formas en todo el mundo.',
  },
  [ODSEnum.HambreCero]: {
    id: ODSEnum.HambreCero,
    title: 'Hambre Cero',
    description:
      'Poner fin al hambre, lograr la seguridad alimentaria y mejorar la nutrición.',
  },
  [ODSEnum.SaludYBienestar]: {
    id: ODSEnum.SaludYBienestar,
    title: 'Salud y Bienestar',
    description: 'Garantizar una vida sana y promover el bienestar para todos.',
  },
  [ODSEnum.EducacionDeCalidad]: {
    id: ODSEnum.EducacionDeCalidad,
    title: 'Educación de Calidad',
    description: 'Garantizar una educación inclusiva, equitativa y de calidad.',
  },
  [ODSEnum.IgualdadDeGenero]: {
    id: ODSEnum.IgualdadDeGenero,
    title: 'Igualdad de Género',
    description:
      'Lograr la igualdad entre los géneros y empoderar a todas las mujeres y niñas.',
  },
  [ODSEnum.AguaLimpiaYSaneamiento]: {
    id: ODSEnum.AguaLimpiaYSaneamiento,
    title: 'Agua Limpia y Saneamiento',
    description:
      'Garantizar la disponibilidad y la gestión sostenible del agua y el saneamiento.',
  },
  [ODSEnum.EnergiaAsequibleYNoContaminante]: {
    id: ODSEnum.EnergiaAsequibleYNoContaminante,
    title: 'Energía Asequible y No Contaminante',
    description:
      'Garantizar el acceso a una energía asequible, segura y sostenible.',
  },
  [ODSEnum.TrabajoDecenteYCrecimientoEconomico]: {
    id: ODSEnum.TrabajoDecenteYCrecimientoEconomico,
    title: 'Trabajo Decente y Crecimiento Económico',
    description:
      'Promover el crecimiento económico sostenido, inclusivo y sostenible.',
  },
  [ODSEnum.IndustriaInnovacionEInfraestructura]: {
    id: ODSEnum.IndustriaInnovacionEInfraestructura,
    title: 'Industria, Innovación e Infraestructura',
    description:
      'Construir infraestructuras resilientes y promover la industrialización inclusiva.',
  },
  [ODSEnum.ReduccionDeLasDesigualdades]: {
    id: ODSEnum.ReduccionDeLasDesigualdades,
    title: 'Reducción de las Desigualdades',
    description: 'Reducir la desigualdad en y entre los países.',
  },
  [ODSEnum.CiudadesYComunidadesSostenibles]: {
    id: ODSEnum.CiudadesYComunidadesSostenibles,
    title: 'Ciudades y Comunidades Sostenibles',
    description:
      'Lograr que las ciudades y los asentamientos humanos sean inclusivos y sostenibles.',
  },
  [ODSEnum.ProduccionYConsumoResponsables]: {
    id: ODSEnum.ProduccionYConsumoResponsables,
    title: 'Producción y Consumo Responsables',
    description: 'Garantizar modalidades de consumo y producción sostenibles.',
  },
  [ODSEnum.AccionPorElClima]: {
    id: ODSEnum.AccionPorElClima,
    title: 'Acción por el Clima',
    description:
      'Adoptar medidas urgentes para combatir el cambio climático y sus efectos.',
  },
  [ODSEnum.VidaSubmarina]: {
    id: ODSEnum.VidaSubmarina,
    title: 'Vida Submarina',
    description:
      'Conservar y utilizar sosteniblemente los océanos, mares y recursos marinos.',
  },
  [ODSEnum.VidaDeEcosistemasTerrestres]: {
    id: ODSEnum.VidaDeEcosistemasTerrestres,
    title: 'Vida de Ecosistemas Terrestres',
    description:
      'Gestionar sosteniblemente los bosques y detener la pérdida de biodiversidad.',
  },
  [ODSEnum.PazJusticiaEInstitucionesSolidas]: {
    id: ODSEnum.PazJusticiaEInstitucionesSolidas,
    title: 'Paz, Justicia e Instituciones Sólidas',
    description:
      'Promover sociedades pacíficas e inclusivas para el desarrollo sostenible.',
  },
  [ODSEnum.AlianzasParaLograrLosObjetivos]: {
    id: ODSEnum.AlianzasParaLograrLosObjetivos,
    title: 'Alianzas para Lograr los Objetivos',
    description:
      'Fortalecer los medios de ejecución y revitalizar la Alianza Mundial.',
  },
};

export function mapODSEnumListToDetails(odsList: ODSEnum[]): ODSDetail[] {
  return odsList.map((ods) => ({
    id: ods,
    title: odsData[ods]?.title || 'Unknown',
    description: odsData[ods]?.description || 'Description not available',
  }));
}
