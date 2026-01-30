"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { getBookings, createBooking, approveBooking } from "@/services/booking.service";
import { getResources } from "@/services/resource.service";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { toast } from "react-toastify";

export default function BookingsPage() {
  const { token, user } = useAuth();
  const [bookings, setBookings] = useState<any[]>([]);
  const [resources, setResources] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    event_name: "",
    resource_id: "",
    start_time: "",
    end_time: "",
  });

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const res = await getBookings(token!);
      const bookingArray = Array.isArray(res.data) ? res.data : res.data.bookings || res.data.data || [];
      if (user?.designation === "participant") {
  setBookings(bookingArray.filter((b: any) => b.status === "approved"));
} else {
  setBookings(bookingArray);
}

    } catch {
      toast.error("Failed to load bookings");
    } finally {
      setLoading(false);
    }
  };

  const fetchResources = async () => {
    try {
      const res = await getResources(token!);
      const resourceArray = Array.isArray(res.data) ? res.data : res.data.resources || res.data.data || [];
      setResources(resourceArray);
    } catch {
      toast.error("Failed to load resources");
    }
  };

  useEffect(() => {
    if (token) {
      fetchBookings();
      fetchResources();
    }
  }, [token]);

  const handleCreate = async () => {
    if (!form.event_name || !form.resource_id || !form.start_time || !form.end_time) {
      toast.error("Fill all fields");
      return;
    }
    try {
      setLoading(true);
      await createBooking({ ...form, resource_id: Number(form.resource_id) }, token!);
      toast.success("Booking request submitted");
      setForm({ event_name: "", resource_id: "", start_time: "", end_time: "" });
      fetchBookings();
    } catch (err:any) {
      toast.error(err.response?.data?.error || "Booking failed");
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id:number) => {
    try {
      setLoading(true);
      await approveBooking(id, token!);
      toast.success("Booking approved");
      fetchBookings();
    } catch {
      toast.error("Approval failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Bookings</h2>

      {(user?.designation === "organizer" || user?.designation === 'admin') && (
        <Card>
          <h3>Create Booking</h3>
          <Input placeholder="Event Name" value={form.event_name} onChange={(e:any)=>setForm({...form,event_name:e.target.value})}/>
          <select value={form.resource_id} onChange={(e)=>setForm({...form,resource_id:e.target.value})} style={{marginBottom:"12px",padding:"10px",borderRadius:"8px",border:"1px solid var(--gray-border)",width:"100%"}}>
            <option value="">Select Resource</option>
            {resources.map(r=><option key={r.id} value={r.id}>{r.name}</option>)}
          </select>
          <Input type="datetime-local" value={form.start_time} onChange={(e:any)=>setForm({...form,start_time:e.target.value})}/>
          <Input type="datetime-local" value={form.end_time} onChange={(e:any)=>setForm({...form,end_time:e.target.value})}/>
          <Button onClick={handleCreate} disabled={loading}>{loading ? "Submitting..." : "Submit Booking"}</Button>
        </Card>
      )}

      <div style={{ marginTop: "30px" }}>
        <h3>
  {user?.designation === "admin"
    ? "All Bookings"
    : user?.designation === "organizer"
    ? "Your Bookings"
    : "Approved Campus Events"}
</h3>


        {loading && <Card><p style={{ textAlign: "center" }}>Loading...</p></Card>}

        {!loading && bookings.length === 0 && (
          <Card><p style={{ textAlign: "center", color: "#777" }}>No bookings yet.</p></Card>
        )}

        {bookings.map((b) => (
          <Card key={b.id}>
            <h4>{b.event_name}</h4>
            <p>Resource: {b.resource_name}</p>
            <p>{b.start_time} → {b.end_time}</p>

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

            {user?.designation === "admin" && b.status === "pending" && (
              <Button onClick={() => handleApprove(b.id)} disabled={loading}>
                {loading ? "Approving..." : "Approve Booking"}
              </Button>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}
