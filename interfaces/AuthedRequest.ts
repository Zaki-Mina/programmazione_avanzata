import { Request } from "express";
import { AuthUser } from "./AuthUser";

export interface AuthedRequest extends Request {
user?: AuthUser;
}
