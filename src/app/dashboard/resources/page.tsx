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

  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [isFiltered, setIsFiltered] = useState(false);

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
    if (!startTime || !endTime) {
      toast.error("Select both start and end time");
      return;
    }

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

  return (
    <div>
      <h2 style={{ marginBottom: "20px" }}>Campus Resources</h2>

      <Card>
        <h3>Check Resource Availability</h3>
        <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
          <Input type="datetime-local" value={startTime} onChange={(e:any)=>setStartTime(e.target.value)} />
          <Input type="datetime-local" value={endTime} onChange={(e:any)=>setEndTime(e.target.value)} />
        </div>
        <div style={{ display: "flex", gap: "10px" }}>
          <Button onClick={checkAvailability} disabled={loading}>
            {loading ? "Checking..." : "Check Availability"}
          </Button>
          {isFiltered && (
            <Button onClick={() => { fetchResources(); setIsFiltered(false); }}>
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
