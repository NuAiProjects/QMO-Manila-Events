// frontend/src/components/events/CreateEventModal.tsx
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

import { createEvent, updateEvent } from "@/services/events";
import { getBuildings, getFloors, getRooms } from "@/services/locations";
import { getSpeakers } from "@/services/users";

/* ================= TYPES ================= */

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreated: () => void;
  event?: any | null;
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
  session_building_id?: string;
  session_floor_id?: string;
  session_room_id?: string;
  floors?: Floor[];
  rooms?: Room[];
}

/* ================= COMPONENT ================= */

export function CreateEventModal({
  open,
  onOpenChange,
  onCreated,
  event: initialEvent, // ✅ alias to avoid DOM `event`
}: Props) {
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
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
  const [venuesReady, setVenuesReady] = useState(false);
  const isEditMode = Boolean(initialEvent?.id);
  useEffect(() => {
    console.log("🔍 SESSIONS STATE:", sessions);
  }, [sessions]);

  /* ================= EFFECTS ================= */

  useEffect(() => {
    getBuildings().then(setBuildings).catch(console.error);
    getSpeakers().then(setSpeakers).catch(console.error);
  }, []);
  useEffect(() => {
    console.log("🏢 BUILDINGS:", buildings);
  }, [buildings]);

  useEffect(() => {
    if (!initialEvent) return;
    setVenuesReady(false);

    setForm({
      name: initialEvent.event_name,
      description: initialEvent.event_description || "",
      startDate: new Date(initialEvent.start_datetime),
      endDate: new Date(initialEvent.end_datetime),
      startTime: new Date(initialEvent.start_datetime)
        .toISOString()
        .slice(11, 16),
      endTime: new Date(initialEvent.end_datetime).toISOString().slice(11, 16),
    });

    const hydrateSessions = async () => {
      const hydrated: SessionForm[] = [];

      for (const s of initialEvent.sessions || []) {
        const speakerId = s.session_speaker_id ?? s.speaker?.id ?? null;

        const sessionDate = s.session_date
          ? new Date(s.session_date)
          : s.date
          ? new Date(s.date)
          : undefined;

        const startTime = s.session_start_time ?? s.start_time ?? "";
        const endTime = s.session_end_time ?? s.end_time ?? "";

        // 🔁 MAP VENUE NAMES → IDS
        const building = buildings.find(
          (b) => b.building_name === s.venue?.building
        );

        let floors: Floor[] = [];
        let rooms: Room[] = [];

        if (building) {
          floors = await getFloors(building.id);
        }

        const floor = floors.find((f) => f.floor_name === s.venue?.floor);

        if (floor) {
          rooms = await getRooms(floor.id);
        }

        const room = rooms.find((r) => r.room_no === s.venue?.room);

        hydrated.push({
          session_topic: s.session_topic ?? s.topic ?? "",
          session_speaker_id: speakerId,
          session_date: sessionDate,
          session_start_time: startTime,
          session_end_time: endTime,

          // ⬇️ IMPORTANT: assign AFTER options exist
          session_building_id: building ? String(building.id) : undefined,
          session_floor_id: floor ? String(floor.id) : undefined,
          session_room_id: room ? String(room.id) : undefined,

          floors,
          rooms,
        });
      }

      setSessions(hydrated);
      setVenuesReady(true);
    };

    hydrateSessions();
  }, [initialEvent, buildings]);

  // useEffect(() => {
  //   if (!initialEvent || buildings.length === 0 || sessions.length === 0)
  //     return;

  //   const hydrateVenues = async () => {
  //     const updated = await Promise.all(
  //       sessions.map(async (s) => {
  //         let floors = s.floors ?? [];
  //         let rooms = s.rooms ?? [];

  //         if (s.session_building_id && floors.length === 0) {
  //           floors = await getFloors(s.session_building_id);
  //         }

  //         if (s.session_floor_id && rooms.length === 0) {
  //           rooms = await getRooms(s.session_floor_id);
  //         }

  //         return { ...s, floors, rooms };
  //       })
  //     );

  //     setSessions(updated);
  //   };

  //   hydrateVenues();
  // }, [buildings]);

  useEffect(() => {
    // When opening Create Event (no initialEvent), reset everything
    if (!open) return;

    if (!initialEvent) {
      setForm({
        name: "",
        description: "",
        startDate: undefined,
        endDate: undefined,
        startTime: "",
        endTime: "",
      });
      setSessions([]);
      setVenuesReady(true);
    }
  }, [open, initialEvent]);

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
        session_date: form.startDate,
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
    if (
      !form.name ||
      !form.startDate ||
      !form.endDate ||
      !form.startTime ||
      !form.endTime
    ) {
      alert("Missing required event fields");
      return;
    }

    setLoading(true);

    const payload = {
      event_name: form.name,
      event_description: form.description || undefined,
      start_datetime: buildDateTime(form.startDate, form.startTime),
      end_datetime: buildDateTime(form.endDate, form.endTime),
      sessions: sessions.map((s) => ({
        session_topic: s.session_topic || null,
        session_speaker_id: s.session_speaker_id ?? null,
        session_date: s.session_date
          ? s.session_date.toISOString().split("T")[0]
          : null,
        session_start_time: s.session_start_time,
        session_end_time: s.session_end_time,
        session_building_id: Number(s.session_building_id),
        session_floor_id: Number(s.session_floor_id),
        session_room_id: Number(s.session_room_id),
      })),
    };

    try {
      if (isEditMode) {
        await updateEvent(initialEvent.id, payload); // ✅ fixed
      } else {
        await createEvent(payload);
      }
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
  // UI stays the same, bindings now correctly use `form.*`

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditMode ? "Edit Event" : "Create New Event"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <Input
            placeholder="Event name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />

          <Textarea
            placeholder="Event description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />

          <div className="grid grid-cols-2 gap-4">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="justify-start">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {form.startDate
                    ? format(form.startDate, "PPP")
                    : "Start Date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent>
                <Calendar
                  mode="single"
                  selected={form.startDate}
                  onSelect={(d) => setForm({ ...form, startDate: d })}
                />
              </PopoverContent>
            </Popover>

            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="justify-start">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {form.endDate ? format(form.endDate, "PPP") : "End Date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent>
                <Calendar
                  mode="single"
                  selected={form.endDate}
                  onSelect={(d) => setForm({ ...form, endDate: d })}
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              type="time"
              value={form.startTime}
              onChange={(e) => setForm({ ...form, startTime: e.target.value })}
            />
            <Input
              type="time"
              value={form.endTime}
              onChange={(e) => setForm({ ...form, endTime: e.target.value })}
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

          {venuesReady &&
            sessions.map((s, i) => (
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
                    updateSession(i, "session_building_id", v);
                    updateSession(i, "session_floor_id", undefined);
                    updateSession(i, "session_room_id", undefined);
                    getFloors(buildingId).then((floors) =>
                      updateSession(i, "floors", floors)
                    );
                  }}
                  // value={s.session_building_id}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select building" />
                  </SelectTrigger>
                  <SelectContent>
                    {buildings.map((b) => {
                      console.log("🏷️ OPTION VALUE:", String(b.id));
                      return (
                        <SelectItem key={b.id} value={String(b.id)}>
                          {b.building_name}
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>

                {/* Floor */}
                <Select
                  value={
                    s.session_floor_id ? String(s.session_floor_id) : undefined
                  }
                  onValueChange={(v) => {
                    const floorId = Number(v);
                    updateSession(i, "session_floor_id", v);
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
                    s.session_room_id ? String(s.session_room_id) : undefined
                  }
                  onValueChange={(v) => updateSession(i, "session_room_id", v)}
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
                      onSelect={(d) => updateSession(i, "session_date", d)}
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
            {loading
              ? isEditMode
                ? "Saving..."
                : "Creating..."
              : isEditMode
              ? "Save Changes"
              : "Create Event"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
