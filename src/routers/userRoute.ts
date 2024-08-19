import express, { Router } from 'express';
import { UserController } from '../controllers/userController';
import { UserService } from '../services/userService';
import authMiddleware from '../middlewares/authMiddleware';
import { upload } from '../middlewares/multer';
export class UserRoutes {
    public router: Router;
    private userController: UserController;
    constructor() {
        this.router = express.Router()
        const userService = new UserService()
        this.userController = new UserController(userService);
        this.postRoutes();
        this.putRoutes();
    }

    private getRoutes(){
    }

    private postRoutes() {
        this.router.post('/login', this.userController.login.bind(this.userController));
        this.router.post('/register',this.userController.register.bind(this.userController)); 
        this.router.post('/documents', authMiddleware, upload.array('document', 5), this.userController.addDocument.bind(this.userController)); 
    }

    private putRoutes(){
        this.router.put('/', authMiddleware, this.userController.updateUser.bind(this.userController))
        this.router.put('/password', authMiddleware, this.userController.resetPassword.bind(this.userController))
    }

    private deleteRoutes(){
        
    }

}