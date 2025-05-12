import { JWT_SECRET } from '@/utils/constance';
import { jwtVerify } from 'jose'
import { NextRequest } from "next/server";


interface JwtPayload {
    role: string;
    id?: string;
    iat: number;
    exp: number;
}

export const tokenVerify = async (userToken: string, req: NextRequest): Promise<string | null> => {
    const secret = JWT_SECRET
    const token = req.cookies.get(userToken)
    if (!token?.value) {
        return null
    }

    try {
        const { payload } = await jwtVerify(token.value, new TextEncoder().encode(secret));
        const data = payload as unknown as JwtPayload
        return data.role
    } catch (error) {
        console.error('Token verification failed:', error);
        return null;
    }
}