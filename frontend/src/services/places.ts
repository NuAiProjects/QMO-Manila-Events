// frontend/src/services/places.ts

import { apiFetch } from "@/lib/api";

export interface Place {
  id: number;
  name: string;
}

export const getPlaces = (): Promise<Place[]> => {
  return apiFetch("/api/v1/places");
};
