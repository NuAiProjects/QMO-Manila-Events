from fastapi import HTTPException

def require_admin(user):
    if user["role"] != 1:
        raise HTTPException(status_code=403, detail="Admin access required")
