export type Countries = {
  countryCode: string;
  name: string;
};

export type Country = {
  commonName: string;
  officialName: string;
  countryCode: string;
  region: string;
  borders: Border[] | null;
};

type Border = {
  commonName: string;
  officialName: string;
  countryCode: string;
  region: string;
  borders?: Border[] | null;
};

export type Flag = {
  name: string;
  flag: string;
  iso2: string;
  iso3: string;
}

export type FlagApiResponse = {
  error: boolean;
  msg: string;
  data: Flag[];
};

type PopulationCount = {
  year: number;
  value: number;
}

export type Population = {
  country: string;
  code: string;
  iso3: string;
  populationCounts: PopulationCount[];
}

export type ApiResponse = {
  error: boolean;
  msg: string;
  data: Population[];
}
