import { apiFetch } from "@/lib/api";

export interface Speaker {
  id: number;
  firstname: string | null;
  middlename: string | null;
  lastname: string | null;
  ext: string | null;
}

export const getSpeakers = async (): Promise<Speaker[]> => {
  return apiFetch("/api/v1/users/speakers"); // ✅ FIXED
};
