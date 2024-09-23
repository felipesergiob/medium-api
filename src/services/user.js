import { User } from "../models/index";
import { AuthUtils } from "@utils";
import ExceptionUtils from "@utils";
import bcrypt from "bcrypt";
import { pick } from "lodash";

class UserService {
  async create(userData) {
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

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new ExceptionUtils("Invalid password");
    }

    return AuthUtils.generateToken({ id: user.id, email: user.email });
  }

  async update({ userId, changes }) {
    const user = await User.findOne({ where: { id: userId, is_deleted: false } });
  
    await User.update(
      pick(changes, ["name", "email"]),
      { where: { id: userId, is_deleted: false } }
    );
  
    return pick(user, ["id", "name", "email", "updated_at"]);
  }  
  

  async changePassword({ userId, oldPassword, newPassword }) {
    const user = await User.findOne({
      where: { id: userId, is_deleted: false }
    });
  
    const isOldPasswordValid = await bcrypt.compare(oldPassword, user.password);
  
    if (!isOldPasswordValid) {
      return false;
    }
  
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
  
    await User.update({ password: hashedNewPassword }, { where: { id: userId } });
  
    return true; 
  }
  

  async delete(userId) {
    console.log(userId);

    const user = await User.findOne({
      where: { id: userId.id, is_deleted: false }
    });

    console.log(user);
    
    const changes = {
      is_deleted: true
    };

    await User.update(changes, {
      where: { id: user.id, is_deleted: false }
    });

    return { message: "User deleted successfully" };
  }

  async read(userId) {
    const user = await User.findOne({
      where: { id: userId, is_deleted: false },
      attributes: ["id", "name", "email", "created_at"]
    });

    return user;
  }
}

export default UserService;
