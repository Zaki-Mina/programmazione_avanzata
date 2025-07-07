
import { RequestHandler } from "express";
import User from "../models/User";
import { AuthUser } from "../interfaces/AuthUser";

export const hasEnoughCredit: RequestHandler = async (req, res, next) => {
const userData = (req as unknown as Request & { user: AuthUser }).user;
if (!userData) {
    res.status(401).json({ message: "Token mancante o invalido" });
    return;
}
const dbUser = await User.findByPk(userData.id);
if (!dbUser)         { res.status(404).json({ message: "Utente non trovato" }); return; }
if (dbUser.tokens <= 0) { res.status(401).json({ message: "Credito esaurito" }); return; }
next();
};