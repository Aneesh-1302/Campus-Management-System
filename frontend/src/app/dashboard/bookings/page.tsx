"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { getBookings, createBooking, approveBooking } from "@/services/booking.service";
import { getResources } from "@/services/resource.service";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { toast } from "react-toastify";

// Helper function to format date/time nicely (handles UTC strings)
const formatDateTime = (dateString: string) => {
  // Parse the date string and extract components directly to avoid timezone issues
  const date = new Date(dateString);
  const options: Intl.DateTimeFormatOptions = {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
    timeZone: 'UTC'
  };
  return date.toLocaleDateString('en-US', options);
};

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
          <select value={form.resource_id} onChange={(e)=>setForm({...form,resource_id:e.target.value})} style={{marginBottom:"12px",padding:"14px 16px",borderRadius:"10px",border:"1px solid var(--gray-border)",width:"100%",fontSize:"16px",fontFamily:"inherit",backgroundColor:"#fff",cursor:"pointer",appearance:"none",backgroundImage:"url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23555' d='M6 8L1 3h10z'/%3E%3C/svg%3E\")",backgroundRepeat:"no-repeat",backgroundPosition:"right 16px center"}}>
            <option value="">Select Resource</option>
            {resources.map(r=><option key={r.id} value={r.id}>{r.name}</option>)}
          </select>
          
          <div style={{display:"flex",gap:"12px",marginBottom:"12px"}}>
            <div style={{flex:1}}>
              <label style={{display:"block",marginBottom:"6px",fontSize:"14px",fontWeight:500,color:"#555"}}>Start Date</label>
              <input type="date" value={form.start_time.split('T')[0] || ''} onChange={(e)=>setForm({...form,start_time:e.target.value+'T'+(form.start_time.split('T')[1] || '09:00')})} style={{width:"100%",padding:"12px 14px",borderRadius:"10px",border:"1px solid var(--gray-border)",fontSize:"15px",fontFamily:"inherit"}}/>
            </div>
            <div style={{flex:1}}>
              <label style={{display:"block",marginBottom:"6px",fontSize:"14px",fontWeight:500,color:"#555"}}>Start Time</label>
              <select value={form.start_time.split('T')[1] || ''} onChange={(e)=>setForm({...form,start_time:(form.start_time.split('T')[0] || '')+'T'+e.target.value})} style={{width:"100%",padding:"12px 14px",borderRadius:"10px",border:"1px solid var(--gray-border)",fontSize:"15px",fontFamily:"inherit",backgroundColor:"#fff",cursor:"pointer"}}>
                <option value="">Select Time</option>
                <option value="08:00">8:00 AM</option>
                <option value="08:30">8:30 AM</option>
                <option value="09:00">9:00 AM</option>
                <option value="09:30">9:30 AM</option>
                <option value="10:00">10:00 AM</option>
                <option value="10:30">10:30 AM</option>
                <option value="11:00">11:00 AM</option>
                <option value="11:30">11:30 AM</option>
                <option value="12:00">12:00 PM</option>
                <option value="12:30">12:30 PM</option>
                <option value="13:00">1:00 PM</option>
                <option value="13:30">1:30 PM</option>
                <option value="14:00">2:00 PM</option>
                <option value="14:30">2:30 PM</option>
                <option value="15:00">3:00 PM</option>
                <option value="15:30">3:30 PM</option>
                <option value="16:00">4:00 PM</option>
                <option value="16:30">4:30 PM</option>
                <option value="17:00">5:00 PM</option>
                <option value="17:30">5:30 PM</option>
                <option value="18:00">6:00 PM</option>
                <option value="18:30">6:30 PM</option>
                <option value="19:00">7:00 PM</option>
                <option value="19:30">7:30 PM</option>
                <option value="20:00">8:00 PM</option>
              </select>
            </div>
          </div>
          
          <div style={{display:"flex",gap:"12px",marginBottom:"12px"}}>
            <div style={{flex:1}}>
              <label style={{display:"block",marginBottom:"6px",fontSize:"14px",fontWeight:500,color:"#555"}}>End Date</label>
              <input type="date" value={form.end_time.split('T')[0] || ''} onChange={(e)=>setForm({...form,end_time:e.target.value+'T'+(form.end_time.split('T')[1] || '10:00')})} style={{width:"100%",padding:"12px 14px",borderRadius:"10px",border:"1px solid var(--gray-border)",fontSize:"15px",fontFamily:"inherit"}}/>
            </div>
            <div style={{flex:1}}>
              <label style={{display:"block",marginBottom:"6px",fontSize:"14px",fontWeight:500,color:"#555"}}>End Time</label>
              <select value={form.end_time.split('T')[1] || ''} onChange={(e)=>setForm({...form,end_time:(form.end_time.split('T')[0] || '')+'T'+e.target.value})} style={{width:"100%",padding:"12px 14px",borderRadius:"10px",border:"1px solid var(--gray-border)",fontSize:"15px",fontFamily:"inherit",backgroundColor:"#fff",cursor:"pointer"}}>
                <option value="">Select Time</option>
                <option value="08:00">8:00 AM</option>
                <option value="08:30">8:30 AM</option>
                <option value="09:00">9:00 AM</option>
                <option value="09:30">9:30 AM</option>
                <option value="10:00">10:00 AM</option>
                <option value="10:30">10:30 AM</option>
                <option value="11:00">11:00 AM</option>
                <option value="11:30">11:30 AM</option>
                <option value="12:00">12:00 PM</option>
                <option value="12:30">12:30 PM</option>
                <option value="13:00">1:00 PM</option>
                <option value="13:30">1:30 PM</option>
                <option value="14:00">2:00 PM</option>
                <option value="14:30">2:30 PM</option>
                <option value="15:00">3:00 PM</option>
                <option value="15:30">3:30 PM</option>
                <option value="16:00">4:00 PM</option>
                <option value="16:30">4:30 PM</option>
                <option value="17:00">5:00 PM</option>
                <option value="17:30">5:30 PM</option>
                <option value="18:00">6:00 PM</option>
                <option value="18:30">6:30 PM</option>
                <option value="19:00">7:00 PM</option>
                <option value="19:30">7:30 PM</option>
                <option value="20:00">8:00 PM</option>
              </select>
            </div>
          </div>
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
            <h4 style={{marginBottom:"8px",fontSize:"18px"}}>{b.event_name}</h4>
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
