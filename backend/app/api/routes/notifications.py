from fastapi import APIRouter, Depends, HTTPException
from datetime import datetime
from app.api.deps import get_current_user
from app.api.schemas.notifications import NotificationCreate, NotificationPublish, NotificationUpdate
from app.core.supabase import supabase

router = APIRouter(prefix="/notifications", tags=["Notifications"])


# ======================================================
# LIST NOTIFICATIONS (ADMIN)
# ======================================================
@router.get("")
def list_notifications(
    user=Depends(get_current_user),
):
    """
    Admin: list all notifications (draft + published)
    """
    res = (
        supabase
        .table("nu_notifications")
        .select(
            "id, title, content, target_type, message_type, "
            "is_active, published_at, created_at"
        )

        .order("created_at", desc=True)
        .execute()
    )

    return res.data or []


# ======================================================
# CREATE NOTIFICATION (DRAFT)
# ======================================================

@router.post("")
def create_notification_draft(
    payload: NotificationCreate,
    user=Depends(get_current_user),
):
    if payload.target_type == "all":
        if payload.event_ids or payload.session_ids or payload.target_user_ids:
            raise HTTPException(400, "Target type 'all' must not include target IDs")

    elif payload.target_type == "event":
        if not payload.event_ids or payload.session_ids or payload.target_user_ids:
            raise HTTPException(400, "Invalid target fields for 'event'")

    elif payload.target_type == "session":
        if not payload.session_ids or payload.event_ids or payload.target_user_ids:
            raise HTTPException(400, "Invalid target fields for 'session'")

    elif payload.target_type == "user":
        if not payload.target_user_ids or payload.event_ids or payload.session_ids:
            raise HTTPException(400, "Invalid target fields for 'user'")

    rows = []
    now = datetime.utcnow().isoformat()

    if payload.target_type == "all":
        rows.append({
            "from_admin_user_id": user["id"],
            "title": payload.title,
            "content": payload.content,
            "target_type": "all",
            "message_type": payload.message_type,
            "is_active": False,
            "created_at": now,
        })

    elif payload.target_type == "event":
        for event_id in payload.event_ids:
            rows.append({
                "from_admin_user_id": user["id"],
                "title": payload.title,
                "content": payload.content,
                "target_type": "event",
                "event_id": event_id,
                "message_type": payload.message_type,
                "is_active": False,
                "created_at": now,
            })

    elif payload.target_type == "session":
        for session_id in payload.session_ids:
            rows.append({
                "from_admin_user_id": user["id"],
                "title": payload.title,
                "content": payload.content,
                "target_type": "session",
                "session_id": session_id,
                "message_type": payload.message_type,
                "is_active": False,
                "created_at": now,
            })

    elif payload.target_type == "user":
        for target_user_id in payload.target_user_ids:
            rows.append({
                "from_admin_user_id": user["id"],
                "title": payload.title,
                "content": payload.content,
                "target_type": "user",
                "target_user_id": target_user_id,
                "message_type": payload.message_type,
                "is_active": False,
                "created_at": now,
            })

    res = supabase.table("nu_notifications").insert(rows).execute()

    if not res.data:
        raise HTTPException(400, "Failed to create notification drafts")

    return {
        "created_count": len(res.data),
        "notification_ids": [n["id"] for n in res.data],
    }


# ======================================================
# PUBLISH NOTIFICATIONS (FAN-OUT)
# ======================================================
@router.post("/publish")
def publish_notifications(
    payload: NotificationPublish,
    user=Depends(get_current_user),
):
    published = []
    skipped = []
    failed = []

    now = datetime.utcnow().isoformat()

    for notif_id in payload.notification_ids:
        notif_res = (
            supabase
            .table("nu_notifications")
            .select("*")
            .eq("id", notif_id)
            .single()
            .execute()
        )

        if not notif_res.data:
            failed.append(notif_id)
            continue

        notif = notif_res.data

        if notif["is_active"]:
            skipped.append(notif_id)
            continue


        # --------------------------------------------------
        # Determine recipients
        # --------------------------------------------------
        recipient_ids = set()

        if notif["target_type"] == "all":
            attendees = (
                supabase
                .table("nu_event_attendees")
                .select("user_id")
                .execute()
            )
            recipient_ids = {r["user_id"] for r in attendees.data or []}

        elif notif["target_type"] == "event":
            attendees = (
                supabase
                .table("nu_event_attendees")
                .select("user_id")
                .eq("event_id", notif["event_id"])
                .execute()
            )
            recipient_ids = {r["user_id"] for r in attendees.data or []}

        elif notif["target_type"] == "session":
            attendees = (
                supabase
                .table("nu_event_attendees")
                .select("user_id")
                .eq("session_id", notif["session_id"])
                .execute()
            )
            recipient_ids = {r["user_id"] for r in attendees.data or []}

        elif notif["target_type"] == "user":
            recipient_ids = {notif["target_user_id"]}

        # --------------------------------------------------
        # Fan-out insert
        # --------------------------------------------------
        rows = [
            {
                "notif_id": notif_id,
                "user_id_receiver": uid,
            }
            for uid in recipient_ids
        ]

        if rows:
            supabase.table("nu_notification_status") \
                .insert(rows, upsert=False) \
                .execute()

        # --------------------------------------------------
        # Mark as published
        # --------------------------------------------------
        supabase.table("nu_notifications") \
            .update({
                "is_active": True,
                "published_at": now,
            }) \
            .eq("id", notif_id) \
            .execute()

        published.append(notif_id)

    return {
        "published": published,
        "skipped": skipped,
        "failed": failed,
    }


# ======================================================
# UPDATE NOTIFICATION (DRAFT ONLY)
# ======================================================
@router.put("/{notification_id}")
def update_notification_draft(
    notification_id: int,
    payload: NotificationCreate,
    user=Depends(get_current_user),
):
    notif_res = (
        supabase
        .table("nu_notifications")
        .select("*")
        .eq("id", notification_id)
        .single()
        .execute()
    )

    if not notif_res.data:
        raise HTTPException(404, "Notification not found")

    notif = notif_res.data

    if notif["is_active"]:
        raise HTTPException(400, "Published notifications cannot be edited")

    # Normalize
    event_ids = payload.event_ids or []
    session_ids = payload.session_ids or []
    target_user_ids = payload.target_user_ids or []

    # Validation
    if payload.target_type == "all":
        if event_ids or session_ids or target_user_ids:
            raise HTTPException(400, "Target type 'all' must not include target IDs")

    elif payload.target_type == "event":
        if not event_ids or session_ids or target_user_ids:
            raise HTTPException(400, "Invalid target fields for 'event'")

    elif payload.target_type == "session":
        if not session_ids or event_ids or target_user_ids:
            raise HTTPException(400, "Invalid target fields for 'session'")

    elif payload.target_type == "user":
        if not target_user_ids or event_ids or session_ids:
            raise HTTPException(400, "Invalid target fields for 'user'")

    update_data = {
    "title": payload.title,
    "content": payload.content,
    "message_type": payload.message_type,
    "target_type": payload.target_type,
}

    if payload.target_type == "event":
        update_data["event_id"] = event_ids[0]

    elif payload.target_type == "session":
        update_data["session_id"] = session_ids[0]

    elif payload.target_type == "user":
        update_data["target_user_id"] = target_user_ids[0]


    supabase.table("nu_notifications") \
        .update(update_data) \
        .eq("id", notification_id) \
        .execute()

    return {"status": "updated"}
