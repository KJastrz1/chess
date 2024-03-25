import { IUserModel } from "@src/models/User";
import { Request } from "express";

export interface AuthenticatedRequest extends Request {
    user: IUserModel;
}

