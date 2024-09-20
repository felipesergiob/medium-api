import { UserController } from "@controllers";
import BaseRoutes from "./base";

export default class UserRoutes extends BaseRoutes {
	constructor() {
		super();
		this.userController = new UserController();
	}

	setup() {
		this.router.post("/create", this.userController.create.bind(this.userController));
		this.router.post("/login", this.userController.authenticate.bind(this.userController));
		this.router.put("/profile/update", this.userController.update.bind(this.userController));
		this.router.put("/password/change", this.userController.changePassword.bind(this.userController));
		this.router.delete("/delete/:id", this.userController.delete.bind(this.userController));
		this.router.get("/profile/:id", this.userController.read.bind(this.userController));

		return this.router;
	}
}
