"use client";

import { useForm } from "react-hook-form";
import { loginUser } from "@/services/auth.service";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import Link from "next/link";
import styles from "@/styles/auth.module.css";

export default function LoginPage() {
  const { register, handleSubmit } = useForm();
  const { login } = useAuth();
  const router = useRouter();

  const onSubmit = async (data: any) => {
  try {
    // Try real backend first
    const res = await loginUser(data);
    login(res.data.user, res.data.token);
    toast.success("Login successful!");

    redirectByRole(res.data.user.designation);
  } catch (err: any){
    toast.error("Invalid Credentials")
  }
};

const redirectByRole = (role: string) => {
  if (role === "admin") router.push("/dashboard/admin");
  else if (role === "organizer") router.push("/dashboard/organizer");
  else router.push("/dashboard/participant");
};

  return (
    <div className={styles.wrapper}>
      <div className={styles.card}>
        <Card>
          <h2 style={{ marginBottom: "6px" }}>Welcome</h2>
          <p style={{ marginBottom: "18px", fontSize: "14px", color: "#555" }}>
            Login to manage campus resources
          </p>

          <form onSubmit={handleSubmit(onSubmit)}>
            <Input placeholder="Email" {...register("email")} />
            <Input type="password" placeholder="Password" {...register("password")} />
            <Button type="submit">Login</Button>
          </form>

          <p style={{ marginTop: "16px", textAlign: "center", fontSize: "14px" }}>
            Don’t have an account?{" "}
            <Link href="/register" style={{ color: "var(--green-primary)", fontWeight: 600 }}>
              Register here
            </Link>
          </p>
        </Card>
      </div>
    </div>
  );
}
