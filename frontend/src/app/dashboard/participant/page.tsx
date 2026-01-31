"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { getBookings } from "@/services/booking.service";
import Card from "@/components/ui/Card";
import { toast } from "react-toastify";

// Helper to format just the time (UTC)
const formatTime = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
    timeZone: 'UTC'
  });
};

// Helper to format just the date (UTC)
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC'
  });
};

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

      {events.length === 0 && <Card><p style={{ textAlign: "center", color: "#777" }}>No upcoming events yet.</p></Card>}

      {events.map((e) => (
        <Card key={e.id}>
          <h4 style={{marginBottom:"8px",fontSize:"18px"}}>{e.event_name}</h4>
          <p style={{marginBottom:"6px",color:"#555"}}><strong>Resource:</strong> {e.resource_name}</p>
          <div style={{background:"#f8fafc",padding:"12px 16px",borderRadius:"8px"}}>
            <p style={{margin:0,fontSize:"14px",color:"#374151"}}>
              <strong>Date:</strong> {formatDate(e.start_time)}
            </p>
            <p style={{margin:"6px 0 0 0",fontSize:"14px",color:"#374151"}}>
              <strong>Time:</strong> {formatTime(e.start_time)} — {formatTime(e.end_time)}
            </p>
          </div>
        </Card>
      ))}
    </div>
  );
}
