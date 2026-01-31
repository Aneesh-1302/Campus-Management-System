"use client";

import { useAuth } from "@/context/AuthContext";
import { useState } from "react";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { toast } from "react-toastify";

export default function ProfilePage() {
  const { user } = useAuth();

  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!name.trim() || !email.trim()) {
      toast.error("Name and email are required");
      return;
    }

    try {
      setLoading(true);

      // TODO: replace with real API later
      await new Promise((res) => setTimeout(res, 800));

      toast.success("Profile updated successfully");
    } catch {
      toast.error("Update failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: "600px" }}>
      <h2 style={{ marginBottom: "20px" }}>My Profile</h2>

      <Card>
        <p style={{ marginBottom: "8px" }}><strong>Role:</strong> <span style={{ textTransform: "capitalize" }}>{user?.designation}</span></p>
      </Card>

      <Card>
        <h3 style={{ marginBottom: "16px" }}>Edit Profile</h3>

        <div style={{ marginBottom: "12px" }}>
          <label style={{ display: "block", marginBottom: "6px", fontSize: "14px", fontWeight: 500, color: "#555" }}>Full Name</label>
          <Input
            placeholder="Enter your name"
            value={name}
            onChange={(e: any) => setName(e.target.value)}
          />
        </div>

        <div style={{ marginBottom: "16px" }}>
          <label style={{ display: "block", marginBottom: "6px", fontSize: "14px", fontWeight: 500, color: "#555" }}>Email Address</label>
          <Input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e: any) => setEmail(e.target.value)}
          />
        </div>

        <Button onClick={handleSave} disabled={loading}>
          {loading ? "Saving..." : "Save Changes"}
        </Button>
      </Card>
    </div>
  );
}
