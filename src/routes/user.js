import { UserController } from "@controllers";
import BaseRoutes from "./base";
import AuthMiddleware from "@middlewares/auth"; 

export default class UserRoutes extends BaseRoutes {
	constructor() {
		super();
		this.userController = new UserController();
	}

	setup() {
		this.router.post("/create", this.userController.create.bind(this.userController));
		this.router.post("/login", this.userController.login.bind(this.userController));		
		this.router.put("/update", AuthMiddleware.isAuthorized, this.userController.update.bind(this.userController)); 
		this.router.put("/update/pass", AuthMiddleware.isAuthorized, this.userController.updatePassword.bind(this.userController));
		this.router.delete("/delete/:id", AuthMiddleware.isAuthorized, this.userController.delete.bind(this.userController));
		this.router.get("/profile/:id", AuthMiddleware.isAuthorized, this.userController.read.bind(this.userController));

		return this.router;
	}
}
