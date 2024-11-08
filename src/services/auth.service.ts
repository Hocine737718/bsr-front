import { api } from "./api";
import type { LoginInterface } from "./interface/auth.interface";

export const Login = (data: LoginInterface) => {
    return api.post("/auth/login", data);
};