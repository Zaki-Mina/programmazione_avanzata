import jwt from 'jsonwebtoken';
import dotenv from 'dotenv'; //La libreria per caricare variabili d'ambiente da un file .env

dotenv.config();

export function createToken(user: { id: number, email: string, role: string }) {
return jwt.sign( // Metodo per creare un nuovo token
    { id: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET as string,
    { expiresIn: '1h' } //per impostare la scadenza a 1 ora
);
}
