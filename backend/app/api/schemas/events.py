# backend/app/api/schemas/events.py
from pydantic import BaseModel
from datetime import datetime
from typing import List, Optional, Literal


from datetime import date, time

class SessionCreate(BaseModel):
    session_topic: Optional[str]
    session_speaker_id: Optional[int]
    session_date: date
    session_start_time: time
    session_end_time: time
    session_building_id: int
    session_floor_id: int
    session_room_id: int



class EventCreate(BaseModel):
    event_name: str
    event_description: Optional[str]
    start_datetime: datetime
    end_datetime: datetime
    status: Optional[Literal["draft", "upcoming", "ongoing"]] = "draft"
    sessions: Optional[List[SessionCreate]]



class SessionOut(SessionCreate):
    id: int


class EventOut(BaseModel):
    id: int
    event_name: str
    event_description: Optional[str]
    start_datetime: datetime
    end_datetime: datetime
    place_id: Optional[int]
    status: str
    sessions: List[SessionOut]
