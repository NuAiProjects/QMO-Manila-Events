from pydantic import BaseModel
from typing import List, Optional, Literal

class NotificationUpdate(BaseModel):
    title: Optional[str] = None
    content: Optional[str] = None
    message_type: Optional[str] = None
    target_type: Optional[str] = None

    event_ids: Optional[List[int]] = None
    session_ids: Optional[List[int]] = None
    target_user_ids: Optional[List[int]] = None


class NotificationCreate(BaseModel):
    message_type: Literal["announcement", "alert", "reminder", "warning"]
    target_type: Literal["all", "event", "session", "user"]

    title: str
    content: str

    event_ids: Optional[List[int]] = None
    session_ids: Optional[List[int]] = None
    target_user_ids: Optional[List[int]] = None


class NotificationPublish(BaseModel):
    notification_ids: List[int]
