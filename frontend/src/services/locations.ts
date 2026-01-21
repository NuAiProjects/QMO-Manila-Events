import { apiFetch } from "@/lib/api";

export const getBuildings = () =>
  apiFetch("/api/v1/locations/buildings");

export const getFloors = (buildingId: number) =>
  apiFetch(`/api/v1/locations/buildings/${buildingId}/floors`);

export const getRooms = (floorId: number) =>
  apiFetch(`/api/v1/locations/floors/${floorId}/rooms`);

export const getPlaces = (roomId: number) =>
  apiFetch(`/api/v1/locations/rooms/${roomId}/places`);
