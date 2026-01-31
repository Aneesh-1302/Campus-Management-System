import "./globals.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "@/components/layout/Navbar";
import { AuthProvider } from "@/context/AuthContext";

export const metadata = {
  title: "Campus Management System",
  description: "Resource & Event Management",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <Navbar />
          <div style={{ padding: "30px" }}>
            {children}
          </div>
          <ToastContainer position="top-right" />
        </AuthProvider>
      </body>
    </html>
  );
}
