import { RequestHandler } from "express";
import jwt from "jsonwebtoken";
import { AuthUser } from "../interfaces/AuthUser";
import dotenv from "dotenv";

// Carica le variabili d'ambiente dal file .env
dotenv.config();

export const verifyToken: RequestHandler = (req, res, next) => {
    const header = req.headers["authorization"];
    const token = header?.split(" ")[1];

    if (!token) {
        res.status(401).json({ message: "Token mancante" });
        return;
    }

    // Legge il secret dal file .env
    const JWT_SECRET = process.env.JWT_SECRET;
    
    if (!JWT_SECRET) {
        console.error("JWT_SECRET non configurato nel file .env");
        res.status(500).json({ message: "Configurazione server mancante" });
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