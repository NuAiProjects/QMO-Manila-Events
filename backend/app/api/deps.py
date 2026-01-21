from fastapi import Header, HTTPException, status
from app.core.supabase import supabase
from supabase_auth.errors import AuthApiError
from supabase import Client

import logging

logger = logging.getLogger(__name__)


def get_current_user(authorization: str = Header(...)):
    if not authorization.startswith("Bearer "):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authorization header",
        )

    token = authorization.replace("Bearer ", "")

    try:
        auth_user = supabase.auth.get_user(token)
    except AuthApiError as e:
        logger.warning(f"JWT verification failed: {e}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token",
        )

    if not auth_user or not auth_user.user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token payload",
        )

    email = auth_user.user.email

    try:
        response = (
            supabase
            .table("nu_users")
            .select("*")
            .eq("email", email)
            .single()
            .execute()
        )
    except Exception as e:
        logger.error(f"DB error fetching user {email}: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to fetch user",
        )

    if not response.data:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="User not registered as admin",
        )

    return response.data
