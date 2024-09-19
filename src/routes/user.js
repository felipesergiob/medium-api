import { UserController } from "@controllers";
import BaseRoutes from "./base";

export default class AttendanceRoutes extends BaseRoutes {
	constructor() {
		super();
		this.userController = new UserController();
	}

	setup() {

		return this.router;
	}
}
