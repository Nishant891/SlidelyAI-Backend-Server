export interface User {
    username: string;
    email: string;
    password: string;
}

export interface RefreshCookie {
    id: string; 
    iat: number; 
    exp: number;
}