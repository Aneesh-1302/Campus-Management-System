"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { getBookings } from "@/services/booking.service";
import Card from "@/components/ui/Card";
import { toast } from "react-toastify";

export default function OrganizerDashboard() {
  const { token, user } = useAuth();
  const [myBookings, setMyBookings] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getBookings(token!);
        const all = Array.isArray(res.data) ? res.data : [];

        setMyBookings(all.filter((b: any) => b.organizer_id === user?.id));
        setEvents(all.filter((b: any) => b.status === "approved"));
      } catch {
        toast.error("Failed to load dashboard");
      }
    };

    if (token) fetchData();
  }, [token, user]);

  return (
    <div>
      <h2>Organizer Dashboard</h2>

      <h3>Your Booking Requests</h3>
      {myBookings.length === 0 && <Card>No booking requests yet.</Card>}
      {myBookings.map((b) => (
        <Card key={b.id}>
          <h4>{b.event_name}</h4>
          <p>Status: <strong>{b.status}</strong></p>
        </Card>
      ))}

      <h3 style={{ marginTop: "30px" }}>Campus Event Updates</h3>
      {events.map((e) => (
        <Card key={e.id}>
          <h4>{e.event_name}</h4>
          <p>{e.start_time} → {e.end_time}</p>
        </Card>
      ))}
    </div>
  );
}
