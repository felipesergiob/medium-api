import { PostController } from "@controllers";
import BaseRoutes from "./base";

export default class PostRoutes extends BaseRoutes {
	constructor() {
		super();
		this.postController = new PostController();
	}

	setup() {
		

		return this.router;
	}
}
