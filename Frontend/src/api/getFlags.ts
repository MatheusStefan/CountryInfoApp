import { Flag } from "../types/types";

export const getFlags = (): Promise<Flag[]> => {
  return fetch('https://countriesnow.space/api/v0.1/countries/flag/images')
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to fetch flags data');
      }
      return response.json();
    })
    .then(data => data.data)
    .catch(error => {
      throw new Error(error.message);
    });
};

