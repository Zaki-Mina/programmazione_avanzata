import { Request } from "express";
import { AuthUser } from "./AuthUser";

//un'interfaccia TypeScript che estende la normale Request di Express 
export interface AuthedRequest extends Request {
user?: AuthUser;
}
