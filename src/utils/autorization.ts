import User, { IUser } from "../schema/User";
import AuthService from "./jwt.utils";

export const authenticateUser = (headerAuth: string | undefined): string => {
  if (!headerAuth) {
    throw new Error("Utilisateur non authentifié");
  }

  const userId = AuthService.getUserId(headerAuth);
  if (!userId) {
    throw new Error("Utilisateur non authentifié");
  }

  return userId;
};

export const fetchUser = async (userId: string): Promise<IUser | null> => {
  console.log(userId)
  return User.findById(userId);
};
