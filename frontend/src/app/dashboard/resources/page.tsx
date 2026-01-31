"use client";

import { useEffect, useState } from "react";
import {
  getResources,
  deleteResource,
  createResource,
  getAvailableResources,
} from "@/services/resource.service";
import { useAuth } from "@/context/AuthContext";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import Input from "@/components/ui/Input";
import { toast } from "react-toastify";
import styles from "@/styles/resources.module.css";

export default function ResourcesPage() {
  const { token, user } = useAuth();
  const [resources, setResources] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: "", type: "", capacity: "" });

  // Separate date and time for better UX
  const [startDate, setStartDate] = useState("");
  const [startTimeVal, setStartTimeVal] = useState("");
  const [endDate, setEndDate] = useState("");
  const [endTimeVal, setEndTimeVal] = useState("");

  const fetchResources = async () => {
    try {
      setLoading(true);
      const res = await getResources(token!);
      const resourceArray = Array.isArray(res.data)
        ? res.data
        : res.data.resources || res.data.data || [];
      setResources(resourceArray);
    } catch {
      toast.error("Failed to load resources");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchResources();
  }, [token]);

  const [isFiltered, setIsFiltered] = useState(false);

  const handleDelete = async (id: number) => {
    try {
      setLoading(true);
      await deleteResource(id, token!);
      toast.success("Resource removed");
      fetchResources();
    } catch {
      toast.error("Delete failed");
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    if (!form.name || !form.type || !form.capacity) {
      toast.error("Please fill all fields");
      return;
    }

    try {
      setLoading(true);
      await createResource(
        { ...form, capacity: Number(form.capacity) },
        token!
      );
      toast.success("Resource created");
      setShowModal(false);
      setForm({ name: "", type: "", capacity: "" });
      fetchResources();
    } catch {
      toast.error("Creation failed");
    } finally {
      setLoading(false);
    }
  };

  const checkAvailability = async () => {
    if (!startDate || !startTimeVal || !endDate || !endTimeVal) {
      toast.error("Select date and time for both start and end");
      return;
    }

    const startTime = `${startDate}T${startTimeVal}`;
    const endTime = `${endDate}T${endTimeVal}`;

    try {
      setLoading(true);
      const res = await getAvailableResources(startTime, endTime, token!);
      const resourceArray = Array.isArray(res.data)
        ? res.data
        : res.data.resources || res.data.data || [];
      setResources(resourceArray);
      setIsFiltered(true);
      toast.success("Showing available resources");
    } catch {
      toast.error("Failed to fetch availability");
    } finally {
      setLoading(false);
    }
  };

  const selectStyle = {
    width: "100%",
    padding: "12px 14px",
    borderRadius: "10px",
    border: "1px solid var(--gray-border)",
    fontSize: "15px",
    fontFamily: "inherit",
    backgroundColor: "#fff",
    cursor: "pointer"
  };

  return (
    <div>
      <h2 style={{ marginBottom: "20px" }}>Campus Resources</h2>

      <Card>
        <h3 style={{ marginBottom: "16px" }}>Check Resource Availability</h3>
        
        <div style={{ display: "flex", gap: "12px", marginBottom: "12px" }}>
          <div style={{ flex: 1 }}>
            <label style={{ display: "block", marginBottom: "6px", fontSize: "14px", fontWeight: 500, color: "#555" }}>Start Date</label>
            <input 
              type="date" 
              value={startDate} 
              onChange={(e) => setStartDate(e.target.value)} 
              style={{ width: "100%", padding: "12px 14px", borderRadius: "10px", border: "1px solid var(--gray-border)", fontSize: "15px", fontFamily: "inherit" }}
            />
          </div>
          <div style={{ flex: 1 }}>
            <label style={{ display: "block", marginBottom: "6px", fontSize: "14px", fontWeight: 500, color: "#555" }}>Start Time</label>
            <select value={startTimeVal} onChange={(e) => setStartTimeVal(e.target.value)} style={selectStyle}>
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

        <div style={{ display: "flex", gap: "12px", marginBottom: "16px" }}>
          <div style={{ flex: 1 }}>
            <label style={{ display: "block", marginBottom: "6px", fontSize: "14px", fontWeight: 500, color: "#555" }}>End Date</label>
            <input 
              type="date" 
              value={endDate} 
              onChange={(e) => setEndDate(e.target.value)} 
              style={{ width: "100%", padding: "12px 14px", borderRadius: "10px", border: "1px solid var(--gray-border)", fontSize: "15px", fontFamily: "inherit" }}
            />
          </div>
          <div style={{ flex: 1 }}>
            <label style={{ display: "block", marginBottom: "6px", fontSize: "14px", fontWeight: 500, color: "#555" }}>End Time</label>
            <select value={endTimeVal} onChange={(e) => setEndTimeVal(e.target.value)} style={selectStyle}>
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

        <div style={{ display: "flex", gap: "10px" }}>
          <Button onClick={checkAvailability} disabled={loading}>
            {loading ? "Checking..." : "Check Availability"}
          </Button>
          {isFiltered && (
            <Button onClick={() => { fetchResources(); setIsFiltered(false); setStartDate(""); setStartTimeVal(""); setEndDate(""); setEndTimeVal(""); }}>
              Show All
            </Button>
          )}
        </div>
      </Card>

      {user?.designation === "admin" && (
        <div style={{ margin: "20px 0" }}>
          <Button onClick={() => setShowModal(true)}>+ Add Resource</Button>
        </div>
      )}

      <div className={styles.grid}>
        {loading && <Card><p style={{ textAlign: "center" }}>Loading...</p></Card>}

        {!loading && resources.length === 0 && (
          <Card><p style={{ textAlign: "center", color: "#777" }}>No resources found.</p></Card>
        )}

        {resources.map((r) => (
          <Card key={r.id}>
            <h3>{r.name}</h3>
            <p>Type: {r.type}</p>
            <p>Capacity: {r.capacity}</p>

            {user?.designation === "admin" && (
              <Button onClick={() => handleDelete(r.id)} disabled={loading}>
                {loading ? "Working..." : "Delete"}
              </Button>
            )}
          </Card>
        ))}
      </div>

      {showModal && (
        <Modal onClose={() => setShowModal(false)}>
          <h3>Add Resource</h3>
          <Input placeholder="Name" value={form.name} onChange={(e:any)=>setForm({...form,name:e.target.value})}/>
          <Input placeholder="Type" value={form.type} onChange={(e:any)=>setForm({...form,type:e.target.value})}/>
          <Input placeholder="Capacity" type="number" value={form.capacity} onChange={(e:any)=>setForm({...form,capacity:e.target.value})}/>
          <Button onClick={handleCreate} disabled={loading}>
            {loading ? "Saving..." : "Save Resource"}
          </Button>
        </Modal>
      )}
    </div>
  );
}
