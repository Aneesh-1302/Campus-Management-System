import jwt from "jsonwebtoken";

export const authenticate = (req, res, next) => {
  try {
    // 1. Get Authorization header
    const authHeader = req.headers.authorization;

    // 2. Check if header exists
    if (!authHeader) {
      return res.status(401).json({ error: "Authorization token missing" });
    }

    // 3. Extract token (Bearer <token>)
    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({ error: "Invalid authorization format" });
    }

    // 4. Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 5. Attach user info to request
    req.user = {
      id: decoded.id,
      designation: decoded.designation
    };

    // 6. Allow request to continue
    next();

  } catch (err) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
};