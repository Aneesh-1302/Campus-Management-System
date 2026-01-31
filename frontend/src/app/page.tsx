"use client";

import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  const handleGetStarted = () => {
    router.push("/login");
  };

  return (
    <div style={{ maxWidth: "600px", margin: "40px auto" }}>
      <Card>
        <h2 style={{ marginBottom: "10px" }}>
          Campus Management System
        </h2>
        <p style={{ marginBottom: "20px" }}>
          Manage campus resources, bookings, and events in one place.
        </p>
        <Button onClick={handleGetStarted}>Get Started</Button>
      </Card>
    </div>
  );
}
