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
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    try {
      setLoading(true);

      // TODO: replace with real API later
      await new Promise((res) => setTimeout(res, 800));

      toast.success("Profile updated (frontend only)");
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
        <p><strong>Email:</strong> {user?.email}</p>
        <p><strong>Role:</strong> {user?.designation}</p>
      </Card>

      <Card>
        <h3>Edit Profile</h3>

        <Input
          placeholder="Full Name"
          value={name}
          onChange={(e: any) => setName(e.target.value)}
        />

        <Button onClick={handleSave} disabled={loading}>
          {loading ? "Saving..." : "Save Changes"}
        </Button>
      </Card>
    </div>
  );
}
