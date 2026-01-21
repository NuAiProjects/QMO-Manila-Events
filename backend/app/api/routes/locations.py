from fastapi import APIRouter
from app.core.supabase import supabase

router = APIRouter(prefix="/locations", tags=["Locations"])

@router.get("/buildings")
def list_buildings():
    return (
        supabase
        .table("nu_buildings")
        .select("id, building_name")
        .order("building_name")
        .execute()
        .data
    )

@router.get("/buildings/{building_id}/floors")
def list_floors(building_id: int):
    return (
        supabase
        .table("nu_floors")
        .select("id, floor_name")
        .eq("building_id", building_id)
        .order("floor_name")
        .execute()
        .data
    )

@router.get("/floors/{floor_id}/rooms")
def list_rooms(floor_id: int):
    return (
        supabase
        .table("nu_rooms")
        .select("id, room_no")
        .eq("floor_id", floor_id)
        .order("room_no")
        .execute()
        .data
    )

@router.get("/rooms/{room_id}/places")
def list_places(room_id: int):
    return (
        supabase
        .table("nu_places")
        .select("id, place_name")
        .eq("room_id", room_id)
        .order("place_name")
        .execute()
        .data
    )
