from fastapi import APIRouter, Depends
from app.api.deps import get_current_user
from app.core.supabase import supabase

router = APIRouter(prefix="/users", tags=["Users"])


@router.get("/speakers")
def list_speakers(
    user=Depends(get_current_user),  # ensures authenticated access
):
    """
    Returns users eligible to be speakers.
    Business rule: role = 1
    """

    res = (
        supabase
        .table("nu_users")
        .select("id, firstname, middlename, lastname, ext")
        .eq("role", 1)
        .order("lastname", desc=False)
        .execute()
    )

    return res.data or []
