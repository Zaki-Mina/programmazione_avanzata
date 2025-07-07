import { RequestHandler } from "express";
import jwt from "jsonwebtoken";
import { AuthUser } from "../interfaces/AuthUser";

//  la chiave scritta a mano, solo per debug (ToDo: verificare file.env)
const JWT_SECRET = "supersegreta_supersegreta1234566";

export const verifyToken: RequestHandler = (req, res, next) => {
const header = req.headers["authorization"];
const token  = header?.split(" ")[1];

if (!token) {
    res.status(401).json({ message: "Token mancante" });
    return;
}

try {
    const decoded = jwt.verify(token, JWT_SECRET) as AuthUser;
    (req as unknown as Request & { user: AuthUser }).user = decoded;
    next();
} catch (err) {
    console.error("Errore verifica token:", err);
    res.status(401).json({ message: "Token non valido" });
}
};
