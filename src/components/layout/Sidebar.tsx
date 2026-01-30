"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useState } from "react";
import {
  LayoutDashboard,
  Building2,
  CalendarCheck,
  Shield,
  LogOut,
  ChevronLeft,
  ChevronRight,
  User,
} from "lucide-react";
import styles from "./Sidebar.module.css";

export default function Sidebar({ role }: { role: string }) {
  const { logout } = useAuth();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className={styles.sidebar}
  style={{ width: collapsed ? "70px" : "230px" }}>
  <button
    className={styles.toggle}
    onClick={() => setCollapsed(!collapsed)}
  >
    {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
  </button>

  <h3 className={styles.logo}>{collapsed ? "CMS" : "Campus MS"}</h3>


      <nav className={styles.nav}>
        {/* PARTICIPANT */}
        {role === "participant" && (
          <>
            <Link href="/dashboard/participant">
              <LayoutDashboard size={18} />
              {!collapsed && <span>Dashboard</span>}
            </Link>

            <Link href="/dashboard/bookings">
              <CalendarCheck size={18} />
              {!collapsed && <span>Campus Events</span>}
            </Link>
          </>
        )}

        {/* ORGANIZER */}
        {role === "organizer" && (
          <>
            <Link href="/dashboard/organizer">
              <LayoutDashboard size={18} />
              {!collapsed && <span>Dashboard</span>}
            </Link>

            <Link href="/dashboard/bookings">
              <CalendarCheck size={18} />
              {!collapsed && <span>Bookings</span>}
            </Link>

            <Link href="/dashboard/resources">
              <Building2 size={18} />
              {!collapsed && <span>Resources</span>}
            </Link>
          </>
        )}

        {/* ADMIN */}
        {role === "admin" && (
          <>
            <Link href="/dashboard/admin">
              <Shield size={18} />
              {!collapsed && <span>Admin Dashboard</span>}
            </Link>

            <Link href="/dashboard/bookings">
              <CalendarCheck size={18} />
              {!collapsed && <span>Bookings</span>}
            </Link>

            <Link href="/dashboard/resources">
              <Building2 size={18} />
              {!collapsed && <span>Resources</span>}
            </Link>
          </>
        )}

        {/* PROFILE (ALL USERS) */}
        <Link href="/dashboard/profile">
          <User size={18} />
          {!collapsed && <span>Profile</span>}
        </Link>
      </nav>

      <button onClick={logout} className={styles.logout}>
        <LogOut size={18} />
        {!collapsed && <span>Logout</span>}
      </button>
    </div>
  );
}
