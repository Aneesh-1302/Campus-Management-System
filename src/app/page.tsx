import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";

export default function Home() {
  return (
    <div style={{ maxWidth: "600px", margin: "40px auto" }}>
      <Card>
        <h2 style={{ marginBottom: "10px" }}>
          Campus Management System 🚀
        </h2>
        <p style={{ marginBottom: "20px" }}>
          Manage campus resources, bookings, and events in one place.
        </p>
        <Button>Get Started</Button>
      </Card>
    </div>
  );
}
