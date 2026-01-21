import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Trash2, CalendarIcon } from "lucide-react";
import { format } from "date-fns";

import { createEvent } from "@/services/events";
import { getBuildings, getFloors, getRooms } from "@/services/locations";
import { getSpeakers } from "@/services/users";

/* ================= TYPES ================= */

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreated: () => void;
}

interface Building {
  id: number;
  building_name: string;
}

interface Floor {
  id: number;
  floor_name: string;
}

interface Room {
  id: number;
  room_no: string;
}

interface Speaker {
  id: number;
  firstname: string;
  lastname: string;
}

interface SessionForm {
  session_topic?: string;
  session_speaker_id?: number | null;
  session_date?: Date;
  session_start_time: string;
  session_end_time: string;
  session_building_id?: number;
  session_floor_id?: number;
  session_room_id?: number;
  floors?: Floor[];
  rooms?: Room[];
}

/* ================= COMPONENT ================= */

export function CreateEventModal({ open, onOpenChange, onCreated }: Props) {
  const [loading, setLoading] = useState(false);

  const [event, setEvent] = useState({
    name: "",
    description: "",
    startDate: undefined as Date | undefined,
    endDate: undefined as Date | undefined,
    startTime: "",
    endTime: "",
  });

  const [buildings, setBuildings] = useState<Building[]>([]);
  const [speakers, setSpeakers] = useState<Speaker[]>([]);
  const [sessions, setSessions] = useState<SessionForm[]>([]);

  /* ================= EFFECTS ================= */

  useEffect(() => {
    getBuildings().then(setBuildings).catch(console.error);
    getSpeakers().then(setSpeakers).catch(console.error);
  }, []);

  /* ================= HELPERS ================= */

  const buildDateTime = (date: Date, time: string) => {
    const [h, m] = time.split(":").map(Number);
    const d = new Date(date);
    d.setHours(h, m, 0, 0);
    return d.toISOString();
  };

  const addSession = () => {
    setSessions((prev) => [
      ...prev,
      {
        session_topic: "",
        session_speaker_id: null,
        session_date: event.startDate,
        session_start_time: "",
        session_end_time: "",
        floors: [],
        rooms: [],
      },
    ]);
  };

  const updateSession = <K extends keyof SessionForm>(
    index: number,
    key: K,
    value: SessionForm[K]
  ) => {
    setSessions((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [key]: value };
      return copy;
    });
  };

  const removeSession = (index: number) => {
    setSessions((prev) => prev.filter((_, i) => i !== index));
  };

  /* ================= SUBMIT ================= */

  const handleSubmit = async () => {
    console.log("RAW SESSIONS STATE:", sessions);

    if (
      !event.name ||
      !event.startDate ||
      !event.endDate ||
      !event.startTime ||
      !event.endTime
    ) {
      alert("Missing required event fields");
      return;
    }

    const validSessions = sessions.filter(
      (s) =>
        s.session_date &&
        s.session_start_time &&
        s.session_end_time &&
        s.session_building_id &&
        s.session_floor_id &&
        s.session_room_id
    );

    if (sessions.length > 0 && validSessions.length === 0) {
      alert(
        "You added sessions, but none were captured. Please complete all required session fields."
      );
      return;
    }

    setLoading(true);

    const payload = {
      event_name: event.name,
      event_description: event.description || undefined,
      start_datetime: buildDateTime(event.startDate, event.startTime),
      end_datetime: buildDateTime(event.endDate, event.endTime),
      sessions: validSessions.map((s) => ({
        session_topic: s.session_topic || null,
        session_speaker_id: s.session_speaker_id ?? null,
        session_date: s.session_date!.toISOString().split("T")[0],
        session_start_time: s.session_start_time,
        session_end_time: s.session_end_time,
        session_building_id: s.session_building_id!,
        session_floor_id: s.session_floor_id!,
        session_room_id: s.session_room_id!,
      })),
    };

    console.log("CREATE EVENT PAYLOAD:", payload);

    try {
      await createEvent(payload);
      onCreated();
      onOpenChange(false);
    } catch (err) {
      console.error("CREATE EVENT ERROR:", err);
      alert("Failed to create event");
    } finally {
      setLoading(false);
    }
  };

  /* ================= UI ================= */

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Event</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <Input
            placeholder="Event name"
            value={event.name}
            onChange={(e) => setEvent({ ...event, name: e.target.value })}
          />

          <Textarea
            placeholder="Event description"
            value={event.description}
            onChange={(e) =>
              setEvent({ ...event, description: e.target.value })
            }
          />

          <div className="grid grid-cols-2 gap-4">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="justify-start">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {event.startDate
                    ? format(event.startDate, "PPP")
                    : "Start Date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent>
                <Calendar
                  mode="single"
                  selected={event.startDate}
                  onSelect={(d) => setEvent({ ...event, startDate: d })}
                />
              </PopoverContent>
            </Popover>

            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="justify-start">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {event.endDate
                    ? format(event.endDate, "PPP")
                    : "End Date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent>
                <Calendar
                  mode="single"
                  selected={event.endDate}
                  onSelect={(d) => setEvent({ ...event, endDate: d })}
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              type="time"
              value={event.startTime}
              onChange={(e) =>
                setEvent({ ...event, startTime: e.target.value })
              }
            />
            <Input
              type="time"
              value={event.endTime}
              onChange={(e) =>
                setEvent({ ...event, endTime: e.target.value })
              }
            />
          </div>
        </div>

        {/* SESSIONS */}
        <div className="mt-8 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-semibold">Sessions (optional)</h3>
            <Button size="sm" variant="outline" onClick={addSession}>
              <Plus className="h-4 w-4 mr-1" /> Add Session
            </Button>
          </div>

          {sessions.map((s, i) => (
            <div key={i} className="border rounded-lg p-4 space-y-3">
              <div className="flex justify-between">
                <p className="font-medium">Session {i + 1}</p>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => removeSession(i)}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>

              <Input
                placeholder="Session topic"
                value={s.session_topic}
                onChange={(e) =>
                  updateSession(i, "session_topic", e.target.value)
                }
              />

              {/* Speaker */}
              <Select
                value={
                  s.session_speaker_id === null
                    ? "tba"
                    : s.session_speaker_id
                    ? String(s.session_speaker_id)
                    : undefined
                }
                onValueChange={(v) =>
                  updateSession(
                    i,
                    "session_speaker_id",
                    v === "tba" ? null : Number(v)
                  )
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select speaker (optional)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="tba">TBA</SelectItem>
                  {speakers.map((sp) => (
                    <SelectItem key={sp.id} value={String(sp.id)}>
                      {sp.firstname} {sp.lastname}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Building */}
              <Select
                value={
                  s.session_building_id
                    ? String(s.session_building_id)
                    : undefined
                }
                onValueChange={(v) => {
                  const buildingId = Number(v);
                  updateSession(i, "session_building_id", buildingId);
                  updateSession(i, "session_floor_id", undefined);
                  updateSession(i, "session_room_id", undefined);
                  getFloors(buildingId).then((floors) =>
                    updateSession(i, "floors", floors)
                  );
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select building" />
                </SelectTrigger>
                <SelectContent>
                  {buildings.map((b) => (
                    <SelectItem key={b.id} value={String(b.id)}>
                      {b.building_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Floor */}
              <Select
                value={
                  s.session_floor_id
                    ? String(s.session_floor_id)
                    : undefined
                }
                onValueChange={(v) => {
                  const floorId = Number(v);
                  updateSession(i, "session_floor_id", floorId);
                  updateSession(i, "session_room_id", undefined);
                  getRooms(floorId).then((rooms) =>
                    updateSession(i, "rooms", rooms)
                  );
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select floor" />
                </SelectTrigger>
                <SelectContent>
                  {s.floors?.map((f) => (
                    <SelectItem key={f.id} value={String(f.id)}>
                      {f.floor_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Room */}
              <Select
                value={
                  s.session_room_id
                    ? String(s.session_room_id)
                    : undefined
                }
                onValueChange={(v) =>
                  updateSession(i, "session_room_id", Number(v))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select room" />
                </SelectTrigger>
                <SelectContent>
                  {s.rooms?.map((r) => (
                    <SelectItem key={r.id} value={String(r.id)}>
                      {r.room_no}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Session Date */}
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="justify-start">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {s.session_date
                      ? format(s.session_date, "PPP")
                      : "Session Date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent>
                  <Calendar
                    mode="single"
                    selected={s.session_date}
                    onSelect={(d) =>
                      updateSession(i, "session_date", d)
                    }
                  />
                </PopoverContent>
              </Popover>

              <div className="grid grid-cols-2 gap-4">
                <Input
                  type="time"
                  value={s.session_start_time}
                  onChange={(e) =>
                    updateSession(i, "session_start_time", e.target.value)
                  }
                />
                <Input
                  type="time"
                  value={s.session_end_time}
                  onChange={(e) =>
                    updateSession(i, "session_end_time", e.target.value)
                  }
                />
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-end gap-2 mt-6">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? "Creating..." : "Create Event"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
