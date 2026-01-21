from fastapi import APIRouter, Depends, HTTPException
from app.api.deps import get_current_user
from app.api.schemas.events import EventCreate
from app.core.supabase import supabase

router = APIRouter(prefix="/events", tags=["Events"])


# ======================================================
# CREATE EVENT + SESSIONS
# ======================================================
@router.post("")
def create_event(
    payload: EventCreate,
    user=Depends(get_current_user),
):
    # 1️⃣ Create event
    event_res = (
        supabase
        .table("nu_events")
        .insert({
            "event_name": payload.event_name,
            "event_description": payload.event_description,
            "start_datetime": payload.start_datetime.isoformat(),
            "end_datetime": payload.end_datetime.isoformat(),
            "status": payload.status or "draft",
            "event_host_user_id": int(user["id"]),
        })
        .execute()
    )

    if not event_res.data:
        raise HTTPException(status_code=400, detail="Failed to create event")

    event_id = event_res.data[0]["id"]

    # 2️⃣ Create sessions
    if payload.sessions:
        session_rows = []

        for s in payload.sessions:
            session_rows.append({
                "session_event_id": event_id,
                "session_topic": s.session_topic,
                "session_speaker_id": s.session_speaker_id,
                "session_date": s.session_date.isoformat(),
                "session_start_time": s.session_start_time.isoformat(),
                "session_end_time": s.session_end_time.isoformat(),
                "session_building_id": s.session_building_id,
                "session_floor_id": s.session_floor_id,
                "session_room_id": s.session_room_id,
            })

        session_res = (
            supabase
            .table("nu_event_sessions")
            .insert(session_rows)
            .execute()
        )

        if not session_res.data:
            raise HTTPException(
                status_code=400,
                detail="Failed to create event sessions"
            )

    return {"id": event_id}


# ======================================================
# LIST EVENTS
# ======================================================
@router.get("")
def list_events(
    user=Depends(get_current_user),
):
    res = (
        supabase
        .table("nu_events")
        .select("""
            id,
            event_name,
            event_description,
            start_datetime,
            end_datetime,
            nu_event_sessions (
                id,
                nu_rooms (
                    nu_floors (
                        nu_buildings (
                            building_name
                        )
                    )
                )
            ),
            status,
            created_at
        """)
        .neq("status", "archived")
        .order("created_at", desc=True)
        .execute()
    )

    events = []

    for e in res.data or []:
        sessions = e.get("nu_event_sessions") or []

        # session count
        sessions_count = len(sessions)

        # extract first available building name
        venue = None
        for s in sessions:
            try:
                venue = (
                    s["nu_rooms"]
                    ["nu_floors"]
                    ["nu_buildings"]
                    ["building_name"]
                )
                if venue:
                    break
            except (TypeError, KeyError):
                continue

        events.append({
            "id": e["id"],
            "event_name": e["event_name"],
            "event_description": e["event_description"],
            "start_datetime": e["start_datetime"],
            "end_datetime": e["end_datetime"],
            "status": e["status"],
            "sessions_count": sessions_count,
            "venue": venue,
        })

    return events

# ======================================================
# PUBLISH EVENT
# ======================================================
@router.patch("/{event_id}/publish")
def publish_event(
    event_id: int,
    user=Depends(get_current_user),
):
    # 1️⃣ Get event
    event = (
        supabase
        .table("nu_events")
        .select("id, status")
        .eq("id", event_id)
        .single()
        .execute()
    )

    if not event.data:
        raise HTTPException(status_code=404, detail="Event not found")

    if event.data["status"] == "archived":
        raise HTTPException(
            status_code=400,
            detail="Archived events cannot be published"
        )

    # 2️⃣ Update status → published
    res = (
        supabase
        .table("nu_events")
        .update({"status": "published"})
        .eq("id", event_id)
        .execute()
    )

    if not res.data:
        raise HTTPException(status_code=400, detail="Failed to publish event")

    return {
        "id": event_id,
        "status": "published",
    }


# ==========================================================
# ARCHIVE EVENT (SOFT DELETE)
# ==========================================================
@router.patch("/{event_id}/archive")
def archive_event(
    event_id: int,
    user=Depends(get_current_user),
):
    # 1️⃣ Check if event exists
    event_res = (
        supabase
        .table("nu_events")
        .select("id, status")
        .eq("id", event_id)
        .single()
        .execute()
    )

    if not event_res.data:
        raise HTTPException(status_code=404, detail="Event not found")

    # 2️⃣ Prevent double-archiving
    if event_res.data["status"] == "archived":
        raise HTTPException(
            status_code=400,
            detail="Event is already archived"
        )

    # 3️⃣ Archive event
    update_res = (
        supabase
        .table("nu_events")
        .update({"status": "archived"})
        .eq("id", event_id)
        .execute()
    )

    if not update_res.data:
        raise HTTPException(
            status_code=500,
            detail="Failed to archive event"
        )

    return {
        "id": event_id,
        "status": "archived"
    }


# ======================================================
# VIEW EVENT DETAILS
# ======================================================
# ======================================================
# VIEW EVENT DETAILS
# ======================================================
@router.get("/{event_id}")
def view_event_details(
    event_id: int,
    user=Depends(get_current_user),
):
    # 1️⃣ Get event (exclude archived)
    event_res = (
        supabase
        .table("nu_events")
        .select("""
            id,
            event_name,
            event_description,
            start_datetime,
            end_datetime,
            status
        """)
        .eq("id", event_id)
        .neq("status", "archived")
        .single()
        .execute()
    )

    if not event_res.data:
        raise HTTPException(status_code=404, detail="Event not found")

    event = event_res.data

    # 2️⃣ Get sessions (NO user join here)
    sessions_res = (
        supabase
        .table("nu_event_sessions")
        .select("""
            id,
            session_topic,
            session_date,
            session_start_time,
            session_end_time,
            session_speaker_id,
            nu_rooms (
                room_no,
                nu_floors (
                    floor_name,
                    nu_buildings (
                        building_name
                    )
                )
            )
        """)
        .eq("session_event_id", event_id)
        .order("session_date")
        .execute()
    )

    # 3️⃣ Collect speaker IDs
    speaker_ids = {
        s["session_speaker_id"]
        for s in sessions_res.data or []
        if s.get("session_speaker_id")
    }

    speakers_map = {}

    if speaker_ids:
        speakers_res = (
            supabase
            .table("nu_users")
            .select("id, firstname, lastname, email")
            .in_("id", list(speaker_ids))
            .execute()
        )

        speakers_map = {
            u["id"]: {
                "id": u["id"],
                "name": f'{u.get("firstname", "")} {u.get("lastname", "")}'.strip(),
                "email": u.get("email"),
            }
            for u in speakers_res.data or []
        }

    # 4️⃣ Format sessions
    formatted_sessions = []

    for s in sessions_res.data or []:
        venue = None
        try:
            venue = {
                "building": s["nu_rooms"]["nu_floors"]["nu_buildings"]["building_name"],
                "floor": s["nu_rooms"]["nu_floors"]["floor_name"],
                "room": s["nu_rooms"]["room_no"],
            }
        except (TypeError, KeyError):
            pass

        speaker = None
        speaker_id = s.get("session_speaker_id")
        if speaker_id:
            speaker = speakers_map.get(speaker_id)

        formatted_sessions.append({
            "id": s["id"],
            "topic": s["session_topic"],
            "date": s["session_date"],
            "start_time": s["session_start_time"],
            "end_time": s["session_end_time"],
            "speaker": speaker,
            "venue": venue,
        })

    return {
        "id": event["id"],
        "event_name": event["event_name"],
        "event_description": event["event_description"],
        "start_datetime": event["start_datetime"],
        "end_datetime": event["end_datetime"],
        "status": event["status"],
        "sessions": formatted_sessions,
    }
