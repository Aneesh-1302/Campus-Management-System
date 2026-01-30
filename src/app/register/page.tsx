"use client";

import { useForm } from "react-hook-form";
import { registerUser } from "@/services/auth.service";
import { toast } from "react-toastify";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import Link from "next/link";
import styles from "@/styles/auth.module.css";

export default function RegisterPage() {
  const { register, handleSubmit } = useForm();

  const onSubmit = async (data: any) => {
    try {
      await registerUser(data);
      toast.success("Registered successfully! You can now log in.");
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Registration failed");
    }
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.card}>
        <Card>
          <h2 style={{ marginBottom: "6px" }}>Create Account</h2>
          <p style={{ marginBottom: "18px", fontSize: "14px", color: "#555" }}>
            Join the campus management platform
          </p>

          <form onSubmit={handleSubmit(onSubmit)}>
            <Input placeholder="Name" {...register("name")} />
            <Input placeholder="Email" {...register("email")} />
            <Input type="password" placeholder="Password" {...register("password")} />

            <select
              {...register("designation")}
              style={{
                marginBottom: "14px",
                padding: "12px",
                borderRadius: "10px",
                border: "1px solid var(--gray-border)",
                width: "100%",
              }}
            >
              <option value="participant">Participant</option>
              <option value="organizer">Organizer</option>
            </select>

            <Button type="submit">Register</Button>
          </form>

          <p style={{ marginTop: "16px", textAlign: "center", fontSize: "14px" }}>
            Already have an account?{" "}
            <Link href="/login" style={{ color: "var(--green-primary)", fontWeight: 600 }}>
              Login here
            </Link>
          </p>
        </Card>
      </div>
    </div>
  );
}
