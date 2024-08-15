import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { IUser } from '../schema/User';

dotenv.config();

interface JwtPayload {
  id: string;
  email: string;
}

class AuthService {
  private static readonly jwtSecret = process.env.JWT_SIGN_SECRET;
  private static readonly jwtRefreshSecret = process.env.JWT_REFRESH_SECRET;

  public static generateTokenForUser(user: IUser): string {
    if (!AuthService.jwtSecret) {
      throw new Error("JWT secret is not defined");
    }

    return jwt.sign(
      {
        id: user._id.toString(),
        email: user.email,
      },
      AuthService.jwtSecret,
      {
        expiresIn: '48h',
      }
    );
  }
  
  public static jwtSignRefreshToken(user: IUser): string {
    if (!AuthService.jwtRefreshSecret) {
      throw new Error("JWT refresh secret is not defined");
    }

    return jwt.sign(
      {
        id: user._id.toString(),
        email: user.email,
      },
      AuthService.jwtRefreshSecret,
      {
        expiresIn: '7d',
      }
    );
  }

  public static parseAuthorization(authorizationHeader: string | null): string | null {
    if (!authorizationHeader) {
      return null;
    }

    const tokenRegex = /Bearer (.+)/;
    const match = authorizationHeader.match(tokenRegex);
    return match ? match[1] : null;
  }

  public static getUserId(authorization: string | null): string | null {
    const token = AuthService.parseAuthorization(authorization);

    if (token && AuthService.jwtSecret) {
      try {
        const jwtToken = jwt.verify(token, AuthService.jwtSecret) as JwtPayload;
        return jwtToken.id;
      } catch (err) {
        console.error("JWT verification error:", err);
        return null;
      }
    }

    return null;
  }
}

export default AuthService;
