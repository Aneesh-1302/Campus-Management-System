"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { getBookings } from "@/services/booking.service";
import { getResources } from "@/services/resource.service";
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

export default function AdminDashboard() {
  const { token } = useAuth();
  const [pending, setPending] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [resourceCount, setResourceCount] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const bookingsRes = await getBookings(token!);
        const resourcesRes = await getResources(token!);

        const bookings = Array.isArray(bookingsRes.data) ? bookingsRes.data : [];
        const resources = Array.isArray(resourcesRes.data) ? resourcesRes.data : [];

        setPending(bookings.filter((b: any) => b.status === "pending"));
        setEvents(bookings.filter((b: any) => b.status === "approved"));
        setResourceCount(resources.length);
      } catch {
        toast.error("Failed to load admin dashboard");
      }
    };

    if (token) fetchData();
  }, [token]);

  return (
    <div>
      <h2>Admin Dashboard</h2>

      <h3>Pending Booking Requests</h3>
      {pending.length === 0 && <Card>No pending approvals</Card>}
      {pending.map((b) => (
        <Card key={b.id}>
          <h4 style={{marginBottom:"8px"}}>{b.event_name}</h4>
          <p style={{marginBottom:"6px",color:"#555"}}><strong>Resource:</strong> {b.resource_name}</p>
          <div style={{background:"#f8fafc",padding:"12px 16px",borderRadius:"8px"}}>
            <p style={{margin:0,fontSize:"14px",color:"#374151"}}>
              <strong>Date:</strong> {formatDate(b.start_time)}
            </p>
            <p style={{margin:"6px 0 0 0",fontSize:"14px",color:"#374151"}}>
              <strong>Time:</strong> {formatTime(b.start_time)} — {formatTime(b.end_time)}
            </p>
          </div>
        </Card>
      ))}

      <h3 style={{ marginTop: "30px" }}>Campus Events</h3>
      {events.length === 0 && <Card>No approved events yet</Card>}
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

      <h3 style={{ marginTop: "30px" }}>Resource Analytics</h3>
      <Card>
        <h4>Total Resources: {resourceCount}</h4>
      </Card>
    </div>
  );
}
