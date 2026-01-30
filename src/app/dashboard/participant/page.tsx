"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { getBookings } from "@/services/booking.service";
import Card from "@/components/ui/Card";
import { toast } from "react-toastify";

export default function ParticipantDashboard() {
  const { token } = useAuth();
  const [events, setEvents] = useState<any[]>([]);

  useEffect(() => {
  const fetchEvents = async () => {
    try {
      const res = await getBookings(token!);

      // Handle different backend shapes safely
      const all = Array.isArray(res.data)
        ? res.data
        : res.data.bookings || res.data.data || [];

      // IMPORTANT: Only show approved bookings
      const approved = all.filter(
        (b: any) => String(b.status).toLowerCase() === "approved"
      );

      setEvents(approved);
    } catch {
      toast.error("Failed to load events");
    }
  };

  if (token) fetchEvents();
}, [token]);


  return (
    <div>
      <h2>Campus Event Updates</h2>

      {events.length === 0 && <Card>No upcoming events yet.</Card>}

      {events.map((e) => (
        <Card key={e.id}>
          <h3>{e.event_name}</h3>
          <p>📍 {e.resource_name}</p>
          <p>🕒 {e.start_time} → {e.end_time}</p>
        </Card>
      ))}
    </div>
  );
}
