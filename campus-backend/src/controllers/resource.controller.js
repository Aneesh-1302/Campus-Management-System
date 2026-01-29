import { pool } from "../db/pool.js";

/**
 * CREATE resource (admin only)
 */
export const createResource = async (req, res) => {
  try {
    const { name, type, capacity } = req.body;

    if (!name || !type) {
      return res.status(400).json({ error: "Name and type are required" });
    }

    const query = `
      INSERT INTO resources (name, type, capacity)
      VALUES (?, ?, ?)
    `;

    const [result] = await pool.query(query, [
      name,
      type,
      capacity || null
    ]);

    res.status(201).json({
      message: "Resource created",
      resource_id: result.insertId
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create resource" });
  }
};

/**
 * READ all active resources (any logged-in user)
 */
export const getResources = async (req, res) => {
  try {
    const query = `
      SELECT id, name, type, capacity
      FROM resources
      WHERE is_active = TRUE
    `;

    const [rows] = await pool.query(query);

    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch resources" });
  }
};

/**
 * UPDATE resource (admin only)
 */
export const updateResource = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, type, capacity } = req.body;

    const query = `
      UPDATE resources
      SET name = ?, type = ?, capacity = ?
      WHERE id = ? AND is_active = TRUE
    `;

    const [result] = await pool.query(query, [
      name,
      type,
      capacity || null,
      id
    ]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Resource not found" });
    }

    res.json({ message: "Resource updated" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update resource" });
  }
};

/**
 * DELETE resource (soft delete, admin only)
 */
export const deleteResource = async (req, res) => {
  try {
    const { id } = req.params;

    const query = `
      UPDATE resources
      SET is_active = FALSE
      WHERE id = ?
    `;

    const [result] = await pool.query(query, [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Resource not found" });
    }

    res.json({ message: "Resource deactivated" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete resource" });
  }
};

/**
 * GET available resources for a given time range
 */
export const getAvailableResources = async (req, res) => {
  try {
    const { start, end } = req.query;

    if (!start || !end) {
      return res.status(400).json({
        error: "start and end query parameters are required"
      });
    }

    const query = `
      SELECT r.id, r.name, r.type, r.capacity
      FROM resources r
      WHERE r.is_active = TRUE
      AND r.id NOT IN (
        SELECT b.resource_id
        FROM bookings b
        WHERE b.status = 'approved'
        AND b.start_time < ?
        AND b.end_time > ?
      )
    `;

    const [rows] = await pool.query(query, [end, start]);

    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch available resources" });
  }
};