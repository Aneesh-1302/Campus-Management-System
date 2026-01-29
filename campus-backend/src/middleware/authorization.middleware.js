// Allow only admin
export const authorizeAdmin = (req, res, next) => {
  if (req.user.designation !== "admin") {
    return res.status(403).json({ error: "Admin access required" });
  }
  next();
};

// Allow organizer OR admin
export const authorizeOrganizerOrAdmin = (req, res, next) => {
  if (!["organizer", "admin"].includes(req.user.designation)) {
    return res.status(403).json({
      error: "Organizer or admin access required"
    });
  }
  next();
};

// Allow participant OR organizer OR admin (logged-in users)
export const authorizeAnyUser = (req, res, next) => {
  if (!["participant", "organizer", "admin"].includes(req.user.designation)) {
    return res.status(403).json({ error: "Access denied" });
  }
  next();
};