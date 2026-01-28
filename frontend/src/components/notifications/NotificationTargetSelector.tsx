import { useEffect, useState } from "react";
import { getEvents } from "@/services/events";
import { getEventDetails } from "@/services/events";
import { getSpeakers } from "@/services/users";
import { Checkbox } from "@/components/ui/checkbox";

interface Props {
  targetType: string;
  onChange: (data: {
    event_ids?: number[];
    session_ids?: number[];
    target_user_ids?: number[];
  }) => void;
}

export function NotificationTargetSelector({ targetType, onChange }: Props) {
  const [events, setEvents] = useState<any[]>([]);
  const [sessions, setSessions] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);

  const [selected, setSelected] = useState<number[]>([]);

  useEffect(() => {
    setSelected([]);
    onChange({});
  }, [targetType]);

  useEffect(() => {
    if (targetType === "event") {
      getEvents().then(setEvents);
    }

    if (targetType === "session") {
      getEvents().then(async (evts) => {
        const allSessions: any[] = [];
        for (const e of evts) {
          const d = await getEventDetails(e.id);
          allSessions.push(...d.sessions);
        }
        setSessions(allSessions);
      });
    }

    if (targetType === "user") {
      getSpeakers().then(setUsers);
    }
  }, [targetType]);

  const toggle = (id: number) => {
    const updated = selected.includes(id)
      ? selected.filter((i) => i !== id)
      : [...selected, id];

    setSelected(updated);

    if (targetType === "event") onChange({ event_ids: updated });
    if (targetType === "session") onChange({ session_ids: updated });
    if (targetType === "user") onChange({ target_user_ids: updated });
  };

  const items =
    targetType === "event"
      ? events
      : targetType === "session"
      ? sessions
      : users;

  if (targetType === "all") return null;

  return (
    <div className="space-y-2 max-h-64 overflow-y-auto border rounded-md p-3">
      {items.map((item) => (
        <label
          key={item.id}
          className="flex items-center gap-2 text-sm cursor-pointer"
        >
          <Checkbox
            checked={selected.includes(item.id)}
            onCheckedChange={() => toggle(item.id)}
          />
          {item.event_name || item.topic || item.firstname}
        </label>
      ))}
    </div>
  );
}
