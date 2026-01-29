import { pool } from "../db/pool.js";

/**
 * CREATE booking (organizer only)
 */
export const createBooking = async (req, res) => {
  try {
    const { resource_id, start_time, end_time, event_name } = req.body;

    if (!resource_id || !start_time || !end_time || !event_name) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Check availability
    const availabilityQuery = `
      SELECT id FROM bookings
      WHERE resource_id = ?
      AND status = 'approved'
      AND start_time < ?
      AND end_time > ?
    `;

    const [conflicts] = await pool.query(availabilityQuery, [
      resource_id,
      end_time,
      start_time
    ]);

    if (conflicts.length > 0) {
      return res.status(409).json({ error: "Resource not available" });
    }

    // Create booking
    const insertQuery = `
      INSERT INTO bookings (resource_id, user_id, event_name, start_time, end_time)
      VALUES (?, ?, ?, ?, ?)
    `;

    const [result] = await pool.query(insertQuery, [
      resource_id,
      req.user.id,
      event_name,
      start_time,
      end_time
    ]);

    res.status(201).json({
      message: "Booking request created",
      booking_id: result.insertId,
      status: "pending"
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create booking" });
  }
};

/**
 * APPROVE booking (admin only for now)
 */
export const approveBooking = async (req, res) => {
  try {
    const { id } = req.params;

    const query = `
      UPDATE bookings
      SET status = 'approved'
      WHERE id = ?
    `;

    const [result] = await pool.query(query, [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Booking not found" });
    }

    res.json({ message: "Booking approved" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to approve booking" });
  }
};

/**
 * GET bookings (admin sees all, user sees own)
 */
export const getBookings = async (req, res) => {
  try {
    let query = `
      SELECT b.id, b.event_name, b.start_time, b.end_time, b.status,
             r.name AS resource_name
      FROM bookings b
      JOIN resources r ON b.resource_id = r.id
    `;

    const params = [];

    if (req.user.designation !== "admin") {
      query += " WHERE b.user_id = ?";
      params.push(req.user.id);
    }

    const [rows] = await pool.query(query, params);
    res.json(rows);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch bookings" });
  }
};