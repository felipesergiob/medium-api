import { User } from "../models/index";
import { AuthUtils } from "@utils";
import ExceptionUtils from "@utils/ExceptionUtils";
import bcrypt from "bcrypt";
import { pick } from "lodash";

class UserService {
  async createUser(userData) {
    const { email, password, name } = userData;

    const existingUser = await User.findOne({
      where: { email, is_deleted: false }
    });

    if (existingUser) {
      throw new ExceptionUtils("Email already registered");
    }

    const hashedPassword = await bcrypt.hash(password, 6);

    const user = await User.create({
      name,
      email,
      password: hashedPassword
    });

    return pick(user, ["id", "name", "email", "created_at"]);
  }

  async authenticate({ email, password }) {
    const user = await User.findOne({
      where: { email, is_deleted: false }
    });

    if (!user) {
      throw new ExceptionUtils("User not found");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new ExceptionUtils("Invalid password");
    }

    return AuthUtils.generateToken({ id: user.id, email: user.email });
  }

  async updateProfile({ userId, changes }) {
    const user = await User.findOne({
      where: { id: userId, is_deleted: false }
    });

    if (!user) {
      throw new ExceptionUtils("User not found");
    }

    const updatedUser = await user.update(pick(changes, ["name", "email"]));

    return pick(updatedUser, ["id", "name", "email", "updated_at"]);
  }

  async changePassword({ userId, oldPassword, newPassword }) {
    const user = await User.findOne({
      where: { id: userId, is_deleted: false }
    });

    if (!user) {
      throw new ExceptionUtils("User not found");
    }

    const isOldPasswordValid = await bcrypt.compare(oldPassword, user.password);

    if (!isOldPasswordValid) {
      throw new ExceptionUtils("Old password is incorrect");
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    await user.update({ password: hashedNewPassword });

    return { message: "Password changed successfully" };
  }

  async deleteUser(userId) {
    const user = await User.findOne({
      where: { id: userId, is_deleted: false }
    });

    if (!user) {
      throw new ExceptionUtils("User not found");
    }

    await user.update({ is_deleted: true });

    return { message: "User deleted successfully" };
  }

  async getUserProfile(userId) {
    const user = await User.findOne({
      where: { id: userId, is_deleted: false },
      attributes: ["id", "name", "email", "created_at"]
    });

    if (!user) {
      throw new ExceptionUtils("User not found");
    }

    return user;
  }
}

export default UserService;
