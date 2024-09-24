import BaseController from "./base";
import { PostService } from "../services";

class PostController extends BaseController {

  constructor() {
    super();
    this.postService = new PostService();
  }

  async list(req, res) {
    const options = {
      meta: {
        ...req.query
      },
      filter: {
        ...req.auth
      }
    };

    try {
      const posts = await this.postService.list(options);
      return res.json(posts);
    } catch (error) {
      return this.errorHandler(error, req, res);
    }
  }

  async create(req, res) {
    try {
      const { id } = req.auth;
      const { title, content } = req.body;
  
      const newPost = await this.postService.create({ title, content, user_id: id });
      return res.status(201).json({ newPost });
    } catch (error) {
      return this.errorHandler(error, req, res);
    }
  }
  

  async update(req, res) {
    const options = {
      filter: {
        id: req.params.id,
        logged_user_id: req.auth.id
      },
      changes: {
        title: req.body.title,
        content: req.body.content
      }
    };

    try {
      const updatedPost = await this.postService.update(options);
      return res.json(updatedPost);
    } catch (error) {
      return this.errorHandler(error, req, res);
    }
  }

  async delete(req, res) {  
    const options = {
      filter: {
        id: req.params.id
      }
    };

    try {
      await this.postService.delete(options);
      return res.status(204).send();
    } catch (error) {
      return this.errorHandler(error, req, res);
    }
  }

  async read(req, res) {
    try {
      const { id } = req.params;
      const post = await this.postService.read({ id });
      if (!post) return res.status(404).json({ message: "Post not found" });
      return res.json(post);
    } catch (error) {
      return this.errorHandler(error, req, res);
    }
  }

  async like(req, res) {
    const options = {
      filter: {
        post_id: req.body.post_id,
        logged_user_id: req.auth.id
      }
    };

    try {
      const post = await this.postService.like(options);
      return res.json(post);
    } catch (error) {
      return this.errorHandler(error, req, res);
    }
  }

  async dislike(req, res) {
    const options = {
      filter: {
        post_id: req.body.post_id,
        logged_user_id: req.auth.id
      }
    };

    try {
      const post = await this.postService.dislike(options);
      return res.json(post);
    } catch (error) {
      return this.errorHandler(error, req, res);
    }
  }
}

export default PostController;
