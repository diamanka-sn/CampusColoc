import { Request, Response } from "express";
import { UserService } from "../services/userService";
import AuthService from "../utils/jwt.utils";
import bcrypt from "bcrypt";
import User from "../schema/User";
import { AuthRequest } from "../utils/type";
import { VerificationCode } from "../utils/verificationCode";
import { sendMail } from "../utils/sendMail";

export class UserController {
  private userService: UserService;
  private codes: Record<string, VerificationCode> = {};

  constructor(userService: UserService) {
    this.userService = userService;
  }
  async login(req: Request, res: Response) {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "L'adresse email et le mot de passe sont requis." });
    }

    try {
      const user = await this.userService.getByFilter({ email });

      if (!user) {
        return res.status(401).json({ message: "Adresse email incorrecte." });
      }

      const passwordVerif = await bcrypt.compare(password, user.password);

      if (!passwordVerif) {
        return res.status(401).json({ message: "Mot de passe incorrect." });
      }

      const token = AuthService.generateTokenForUser(user);
      return res.status(200).json({ user, token });
    } catch (error) {
      return res.status(500).json({ message: "Erreur serveur." });
    }
  }

  async register(req: Request, res: Response) {
    try {
      const hashedPassword = bcrypt.hashSync(req.body.password, 10);

      const email = await this.userService.getByFilter({
        email: req.body.email,
      });

      if (email) {
        return res.status(401).json({ message: "Adresse email existe déjà." });
      }
      const telephone = await this.userService.getByFilter({
        phone: req.body.phone,
      });
      if (telephone) {
        return res
          .status(401)
          .json({ message: "Le numéro de téléphone existe déjà." });
      }
      const user = new User({
        email: req.body.email,
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        phone: req.body.phone,
        password: hashedPassword,
        location: req.body.location,
      });
      const createdUser = await this.userService.create(user);

      const token = AuthService.generateTokenForUser(createdUser);
      return res.status(200).json({ user: createdUser, token });
    } catch (error) {
      return res.status(500).json({ message: "Erreur serveur." });
    }
  }

  async updateUser(req: AuthRequest, res: Response) {
    try {
      const user = req.body;
      const file = req.file;
      const u = await this.userService.getByFilter({ _id: req.userId });

      if (!u) {
        return res.status(404).json({ message: "Utilisateur introuvable." });
      }

      u.email = user.email ?? u.email;
      u.firstname = user.firstname ?? u.firstname;
      u.lastname = user.lastname ?? u.lastname;
      u.phone = user.phone ?? u.phone;
      u.location = user.location ?? u.location;
      u.imageUrl = file ? file.path : u.imageUrl;

      const updatedUser = await this.userService.update(u._id.toString(), u);

      res.json(updatedUser);
    } catch (error) {
      return res.status(500).json({ message: "Erreur serveur." });
    }
  }

  async resetPassword(req: AuthRequest, res: Response) {
    try {
      const user = await this.userService.getByFilter({ _id: req.userId });
      const { oldPassword, newPassword } = req.body;

      if (!user) {
        return res.status(404).json({ message: "Utilisateur introuvable." });
      }

      const isPasswordValid = await bcrypt.compare(oldPassword, user.password);

      if (!isPasswordValid) {
        return res
          .status(400)
          .json({ message: "Ancien mot de passe incorrect." });
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);
      user.password = hashedPassword;

      const update = await this.userService.update(user._id.toString(), user);
      return res.json({
        message: "Mot de passe mis à jour avec succès.",
        user: update,
      });
    } catch (error) {
      return res.status(500).json({ message: "Erreur serveur." });
    }
  }

  async forgotPassword(req: Request, res: Response) {
    try {
      const { email } = req.body;

      const user = await this.userService.getByFilter({ email: email.trim() });

      if (!user) {
        return res.status(404).json({ message: "Utiliseur introuvable." });
      }

      const code = Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000;
      const expiration = Date.now() + 5 * 60 * 1000;

      this.codes[user._id.toString()] = {
        code: code,
        expiration: expiration,
      };

      const message = `<p>Bonjour ${user.firstname} ${user.lastname}, </p>
        <p>Nous vous informons que votre code de réinitialisation de mot de passe a été généré avec succès :</p>
        <p><strong>${code}</strong></p>
        <p>Ce code est valable pendant 5 minutes à des fins de sécurité.</p>
        <p>En cas de questions ou d'assistance supplémentaire, n'hésitez pas à nous contacter. Nous sommes là pour vous aider.</p>
        <p>Cordialement,</p>
        `;

      const envoie = await sendMail(
        user.email,
        "[Mot de passe] Code de réinitialisation",
        message
      );
      return res.status(200).json(envoie);
    } catch (error) {
      return res.status(500).json({ message: "Erreur serveur" });
    }
  }

  async verifierCode(req: Request, res: Response) {
    try {
      const { code, email } = req.body;

      const user = await this.userService.getByFilter({ email: email.trim() });

      if (!user) {
        return res.status(404).json({ message: "Utiliseur introuvable." });
      }
      const storedCode = this.codes[user._id.toString()];

      if (!storedCode || storedCode.code !== code) {
        return res
          .status(403)
          .json({ message: "Code de réinitialisation incorrect" });
      }

      const now = Date.now();

      if (now > storedCode.expiration) {
        return res
          .status(401)
          .json({ message: "Code de réinitialisation expiré" });
      }

      return res
        .status(200)
        .json({ message: "Code de réinitialisation correct." });
    } catch (error) {
      return res.status(500).json({ message: "Erreur serveur" });
    }
  }

  async resetForgotPassword(req:Request, res:Response){
    try {
        const {email, newPassword} = req.body
        const user = await this.userService.getByFilter(email)

        if(!user){
          return res.status(404).json({message:"Utilisateur introuvable."})
        }

        const hashedPassword = await bcrypt.hash(newPassword.trim(), 10);
        user.password = hashedPassword
        await this.userService.update(user._id.toString(), user);
        return res.status(200).json({message:"Mot de passe réinitialisé avec succès."})
    } catch (error) {
      return res.status(500).json({message:"Erreur serveur"})
    }
  }
}
