import BaseController from "./base";
import { UserService } from "../services";

class UserController extends BaseController {
  constructor() {
    super();
    this.userService = new UserService();
  }

  async create(req, res) {
    try {
      const { name, email, password } = req.data;
      const newUser = await this.userService.create({ name, email, password });
      
      const token = await this.userService.login({ email, password });
      if (!token) return res.status(401).json({ message: "Authentication failed" });
      
      return this.successHandler({ user: newUser, token }, res);
    } catch (error) {
      return this.errorHandler(error, req, res);
    }
  }

  async login(req, res) {
    try {
      const { email, password } = req.data;
      const token = await this.userService.login({ email, password });
      if (!token) return res.status(401).json({ message: "Invalid credentials" });
      return this.successHandler({ token }, res);
    } catch (error) {
      return this.errorHandler(error, req, res);
    }
  }

  async update(req, res) {
    try {
      const { id } = req.auth;
      const { name, email } = req.data;
      const updatedUser = await this.userService.update({ userId: id, changes: { name, email } });
      return this.successHandler(updatedUser, res);
    } catch (error) {
      return this.errorHandler(error, req, res);
    }
  }

  async updatePassword(req, res) {
    try {
      const { id } = req.auth;
      const { currentPassword, newPassword } = req.data;

      if (!id) {
        return res.status(400).json({ message: "User ID not found in the request" });
      }

      const result = await this.userService.updatePassword({ userId: id, oldPassword: currentPassword, newPassword });
      if (!result) {
        return res.status(400).json({ message: "Incorrect current password" });
      }
      return res.status(204).send();
    } catch (error) {
      return this.errorHandler(error, req, res);
    }
  }

  async delete(req, res) {
    try {
      const id = req.params;
      await this.userService.delete(id);
      return res.status(204).send();
    } catch (error) {
      return this.errorHandler(error, req, res);
    }
  }

  async read(req, res) {
    try {
      const { id } = req.params;
      const user = await this.userService.read(id);
      if (!user) return res.status(404).json({ message: "User not found" });
      return this.successHandler(user, res);
    } catch (error) {
      return this.errorHandler(error, req, res);
    }
  }
}

export default UserController;
