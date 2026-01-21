# backend/app/api/routes/places.py

from fastapi import APIRouter
from app.core.supabase import supabase

router = APIRouter(prefix="/places", tags=["Places"])

@router.get("")
def list_places():
    res = (
        supabase
        .table("nu_places")               # ✅ correct table
        .select("id, place_name")         # ✅ correct column
        .order("place_name")
        .execute()
    )
    return res.data
