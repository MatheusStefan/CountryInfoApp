import { Countries } from "../types/types";

export const getCountries = (): Promise<Countries[]> => {
  return fetch(`https://date.nager.at/api/v3/AvailableCountries`)
    .then(response => {
      if (!response.ok) {
        throw new Error('No country to show');
      }
      return response.json();
    })
    .then(data => {
      console.log("API Response:", data);
      return data;
    });
};
