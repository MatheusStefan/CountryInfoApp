import { Countries } from "../types/types";

export const getCountries = (): Promise<Countries[]> => {
  return fetch(`http://localhost:3000/api/countries/available`)
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