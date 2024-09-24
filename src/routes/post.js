import { PostController } from "../controllers";
import BaseRoutes from "./base";

export default class PostRoutes extends BaseRoutes {
	constructor() {
		super();
		this.postController = new PostController();
	}

	setup() {
		this.router.post("/create", this.postController.create.bind(this.postController));
		this.router.get("/read/:id", this.postController.read.bind(this.postController));
		this.router.put("/update/:id", this.postController.update.bind(this.postController));
		this.router.delete("/delete/:id", this.postController.delete.bind(this.postController));
		this.router.get("/list", this.postController.list.bind(this.postController));
		this.router.post("/like", this.postController.like.bind(this.postController));
		this.router.post("/dislike", this.postController.dislike.bind(this.postController));

		return this.router;
	}
}
