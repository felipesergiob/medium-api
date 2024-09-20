import BaseController from "./base";
import { PostService } from "@services";

class PostController extends BaseController {
  
  async list(req, res) {
    try {
      const posts = await PostService.list(req.query);
      return res.json(posts);
    } catch (error) {
      return this.handleError(res, error);
    }
  }

  async create(req, res) {
    try {
      const { title, content, user_id } = req.body;
      const newPost = await PostService.create({ title, content, user_id });
      return res.status(201).json(newPost);
    } catch (error) {
      return this.handleError(res, error);
    }
  }

  async update(req, res) {
    try {
      const { id } = req.params;
      const { title, content } = req.body;
      const updatedPost = await PostService.update({ id, title, content });
      return res.json(updatedPost);
    } catch (error) {
      return this.handleError(res, error);
    }
  }

  async delete(req, res) {
    try {
      const { id } = req.params;
      await PostService.delete({ id });
      return res.status(204).send();
    } catch (error) {
      return this.handleError(res, error);
    }
  }

  async read(req, res) {
    try {
      const { id } = req.params;
      const post = await PostService.read({ id });
      if (!post) return res.status(404).json({ message: "Post not found" });
      return res.json(post);
    } catch (error) {
      return this.handleError(res, error);
    }
  }

  async like(req, res) {
    try {
      const { post_id, user_id } = req.body;
      const post = await PostService.like({ post_id, user_id });
      return res.json(post);
    } catch (error) {
      return this.handleError(res, error);
    }
  }

  async dislike(req, res) {
    try {
      const { post_id, user_id } = req.body;
      const post = await PostService.dislike({ post_id, user_id });
      return res.json(post);
    } catch (error) {
      return this.handleError(res, error);
    }
  }
}

export default PostController;
