import api from "./api";

export const createBooking = (data: any, token: string) =>
  api.post("/bookings", data, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const getBookings = (token: string) =>
  api.get("/bookings", {
    headers: { Authorization: `Bearer ${token}` },
  });

  export const approveBooking = (id: number, token: string) =>
  api.post(`/bookings/${id}/approve`, {}, {
    headers: { Authorization: `Bearer ${token}` },
  });
