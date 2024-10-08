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
        ...req.query,
      },
      filter: {
        ...req.filter,
      },
    };
  
    if (req.auth && req.auth.id) {
      options.filter.logged_user_id = req.auth.id;
    }
    
    try {      
      const posts = await this.postService.list(options);
      return this.successHandler(posts, res);
    } catch (error) {      
      return this.errorHandler(error, req, res);
    }
  }

  async create(req, res) {
    try {
      const { id } = req.auth;
      const { title, content } = req.data;

      const newPost = await this.postService.create({ title, content, user_id: id });
      return this.successHandler({ newPost }, res);
    } catch (error) {
      return this.errorHandler(error, req, res);
    }
  }

  async update(req, res) {
    const options = {
      filter: {
        id: req.params.id,
        logged_user_id: req.auth.id,
      },
      changes: {
        ...req.data,
      },
    };

    try {
      const updatedPost = await this.postService.update(options);
      return this.successHandler(updatedPost, res);
    } catch (error) {
      return this.errorHandler(error, req, res);
    }
  }

  async delete(req, res) {

    const filter = {
      id: req.params.id,
    }
    
    try {
      await this.postService.delete(filter);
      return res.status(204).send();
    } catch (error) {
      return this.errorHandler(error, req, res);
    }
  }

  async read(req, res) {
    const filter = {
      logged_user_id: req.auth.id,
      post_id: req.filter.id,
    };
    
    try {      
      const post = await this.postService.read(filter);
      if (!post) return res.status(404).json({ message: "Post not found" });
      return this.successHandler(post, res);
    } catch (error) {
      return this.errorHandler(error, req, res);
    }
  }

  async like(req, res) {  
    const options = {
      filter: {
        post_id: req.data.post_id,
        logged_user_id: req.auth.id,
      },
    };
    
    try {      
      const post = await this.postService.like(options);
      return this.successHandler(post, res);
    } catch (error) {
      return this.errorHandler(error, req, res);
    }
  }

  async dislike(req, res) {
    const options = {
      filter: {
        post_id: req.data.post_id,
        logged_user_id: req.auth.id,
      },
    };

    try {
      const post = await this.postService.dislike(options);
      return this.successHandler(post, res);
    } catch (error) {
      return this.errorHandler(error, req, res);
    }
  }
}

export default PostController;
