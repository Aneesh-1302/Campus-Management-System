import api from "./api";

export const getResources = (token: string) =>
  api.get("/resources", {
    headers: { Authorization: `Bearer ${token}` },
  });

export const createResource = (data: any, token: string) =>
  api.post("/resources", data, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const updateResource = (id: number, data: any, token: string) =>
  api.put(`/resources/${id}`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const deleteResource = (id: number, token: string) =>
  api.delete(`/resources/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const getAvailableResources = (
  start: string,
  end: string,
  token: string
) =>
  api.get("/resources/available", {
    params: { start, end },
    headers: { Authorization: `Bearer ${token}` },
  });
