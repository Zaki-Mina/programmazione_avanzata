import { RequestHandler } from "express";
import { AuthUser } from "../interfaces/AuthUser";
export const isAdmin: RequestHandler = (req, res, next) => {
const user = (req as unknown as Request & { user: AuthUser }).user;
if (!user)           { res.status(401).json({ message: "Token mancante o invalido" }); return; }
if (user.role !== "admin") { res.status(403).json({ message: "Solo admin" }); return; }
next();
};
