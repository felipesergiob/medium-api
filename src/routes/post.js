import { PostController } from "../controllers";
import { PostSchema } from "@schemas";
import BaseRoutes from "./base";
import AuthMiddleware from "../middlewares/auth";

export default class PostRoutes extends BaseRoutes {
	constructor() {
		super();
		this.postController = new PostController();
	}

	setup() {
		this.router.get("/list", this.SchemaValidator.validate(PostSchema.list),this.postController.list.bind(this.postController));
		this.router.use(AuthMiddleware.isAuthorized);
		this.router.post("/create", this.SchemaValidator.validate(PostSchema.create),this.postController.create.bind(this.postController));
		this.router.get("/read/:id", this.SchemaValidator.validate(PostSchema.get),this.postController.read.bind(this.postController));
		this.router.put("/update/:id", this.SchemaValidator.validate(PostSchema.update),this.postController.update.bind(this.postController));
		this.router.delete("/delete/:id", this.SchemaValidator.validate(PostSchema.remove),this.postController.delete.bind(this.postController));
		this.router.post("/like", this.SchemaValidator.validate(PostSchema.like),this.postController.like.bind(this.postController));
		this.router.post("/dislike", this.SchemaValidator.validate(PostSchema.dislike),this.postController.dislike.bind(this.postController));

		return this.router;
	}
}
