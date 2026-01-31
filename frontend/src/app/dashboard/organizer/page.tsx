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

export default function OrganizerDashboard() {
  const { token, user } = useAuth();
  const [myBookings, setMyBookings] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getBookings(token!);
        const all = Array.isArray(res.data) ? res.data : res.data.bookings || res.data.data || [];

        // Filter bookings created by this user (user_id matches)
        setMyBookings(all.filter((b: any) => b.user_id === user?.id));
        // Show all approved events as campus updates
        const approvedEvents = all.filter((b: any) => String(b.status).toLowerCase() === "approved");
        setEvents(approvedEvents);
      } catch (err) {
        console.error("Error fetching bookings:", err);
        toast.error("Failed to load dashboard");
      }
    };

    if (token) fetchData();
  }, [token, user]);

  return (
    <div>
      <h2>Organizer Dashboard</h2>

      <h3 style={{ marginTop: "20px" }}>Your Booking Requests</h3>
      {myBookings.length === 0 && <Card><p style={{ textAlign: "center", color: "#777" }}>No booking requests yet.</p></Card>}
      {myBookings.map((b) => (
        <Card key={b.id}>
          <h4 style={{marginBottom:"8px"}}>{b.event_name}</h4>
          <p style={{marginBottom:"6px",color:"#555"}}><strong>Resource:</strong> {b.resource_name}</p>
          <div style={{background:"#f8fafc",padding:"12px 16px",borderRadius:"8px",marginBottom:"12px"}}>
            <p style={{margin:0,fontSize:"14px",color:"#374151"}}>
              <strong>Date:</strong> {formatDate(b.start_time)}
            </p>
            <p style={{margin:"6px 0 0 0",fontSize:"14px",color:"#374151"}}>
              <strong>Time:</strong> {formatTime(b.start_time)} — {formatTime(b.end_time)}
            </p>
          </div>
          <p>
            Status:{" "}
            <span style={{
              padding:"4px 10px",
              borderRadius:"20px",
              fontSize:"12px",
              fontWeight:600,
              background: b.status==="approved"?"#dcfce7":b.status==="pending"?"#fef3c7":"#fee2e2",
              color: b.status==="approved"?"#15803d":b.status==="pending"?"#b45309":"#b91c1c",
              textTransform:"capitalize"
            }}>
              {b.status}
            </span>
          </p>
        </Card>
      ))}

      <h3 style={{ marginTop: "30px" }}>Campus Event Updates</h3>
      {events.length === 0 && <Card><p style={{ textAlign: "center", color: "#777" }}>No approved events yet.</p></Card>}
      {events.map((e) => (
        <Card key={e.id}>
          <h4 style={{marginBottom:"8px"}}>{e.event_name}</h4>
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
