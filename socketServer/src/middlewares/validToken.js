import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.SECRET_KEY;

export const isValidToken = (token) => {
  if (!token) return false;

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    return decoded;
  } catch (err) {
    console.error("Token validation error:", err);
    return false;
  }
};
