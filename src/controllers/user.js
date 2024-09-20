import BaseController from "./base";
import { UserService } from "@services";

class UserController extends BaseController {

  async create(req, res) {
    try {
      const { name, email, password } = req.body;
      const newUser = await UserService.create({ name, email, password });
      return res.status(201).json(newUser);
    } catch (error) {
      return this.handleError(res, error);
    }
  }

  async authenticate(req, res) {
    try {
      const { email, password } = req.body;
      const token = await UserService.authenticate({ email, password });
      if (!token) return res.status(401).json({ message: "Invalid credentials" });
      return res.json({ token });
    } catch (error) {
      return this.handleError(res, error);
    }
  }

  async update(req, res) {
    try {
      const { id } = req.user;
      const { name, email } = req.body;
      const updatedUser = await UserService.update(id, { name, email });
      return res.json(updatedUser);
    } catch (error) {
      return this.handleError(res, error);
    }
  }

  async changePassword(req, res) {
    try {
      const { id } = req.user; 
      const { currentPassword, newPassword } = req.body;
      const result = await UserService.changePassword(id, currentPassword, newPassword);
      if (!result) return res.status(400).json({ message: "Incorrect current password" });
      return res.status(204).send();
    } catch (error) {
      return this.handleError(res, error);
    }
  }

  async delete(req, res) {
    try {
      const { id } = req.params;
      await UserService.update(id, { is_deleted: true });
      return res.status(204).send();
    } catch (error) {
      return this.handleError(res, error);
    }
  }

  async read(req, res) {
    try {
      const { id } = req.params;
      const user = await UserService.getOne({ where: { id, is_deleted: false } });
      if (!user) return res.status(404).json({ message: "User not found" });
      return res.json(user);
    } catch (error) {
      return this.handleError(res, error);
    }
  }
}

export default UserController;
