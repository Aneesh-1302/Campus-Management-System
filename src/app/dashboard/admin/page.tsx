"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { getBookings } from "@/services/booking.service";
import { getResources } from "@/services/resource.service";
import Card from "@/components/ui/Card";
import { toast } from "react-toastify";

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
          <h4>{b.event_name}</h4>
          <p>{b.start_time} → {b.end_time}</p>
        </Card>
      ))}

      <h3 style={{ marginTop: "30px" }}>Campus Events</h3>
      {events.map((e) => (
        <Card key={e.id}>
          <h4>{e.event_name}</h4>
          <p>{e.start_time} → {e.end_time}</p>
        </Card>
      ))}

      <h3 style={{ marginTop: "30px" }}>Resource Analytics</h3>
      <Card>
        <h4>Total Resources: {resourceCount}</h4>
      </Card>
    </div>
  );
}
