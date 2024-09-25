import { User } from "../models/index";
import { pick } from "lodash";
import bcrypt from "bcrypt";
import ExceptionUtils from "@utils";
import { AuthUtils } from "@utils";

class UserService {
  async create(user) {
    const transaction = await User.sequelize.transaction();

    try {
      user.password = await bcrypt.hash(user.password, 6);

      const userCreated = await User.create(user, { transaction });

      await transaction.commit();

      return pick(userCreated, ["id", "name", "email", "created_at"]);
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  async login(data) {
    const { email, password } = data;

    const user = await User.findOne({
      where: { email, is_deleted: false },
      attributes: ["id", "email", "password"],
      raw: false,
    });

    if (!user || !this.isValidPassword(password, user.password)) {
      throw new ExceptionUtils("NOT_FOUND");
    }

    const token = AuthUtils.generateToken({ id: user.id });

    return { user: pick(user, ["id", "email", "name"]), token };
  }

  async read(id) {
    const user = await User.findOne({
      where: { id, is_deleted: false },
      attributes: ["id", "name", "email", "created_at"],
      raw: false,
    });

    if (!user) {
      throw new ExceptionUtils("NOT_FOUND");
    }

    return pick(user, ["id", "name", "email", "created_at"]);
  }

  async update({ changes, filter }) {
    const transaction = await User.sequelize.transaction();

    try {
      if (changes.password) {
        changes.password = await bcrypt.hash(changes.password, 10);
      }

      const [_, userUpdated] = await User.update(changes, {
        where: { ...filter, is_deleted: false },
        transaction,
        returning: true,
      });

      await transaction.commit();

      return pick(userUpdated[0], ["id", "name", "email", "updated_at"]);
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  async delete(filter) {
    const transaction = await User.sequelize.transaction();

    try {
      const userDeleted = await User.update(
        { is_deleted: true },
        {
          where: { ...filter, is_deleted: false },
          transaction,
        }
      );

      await transaction.commit();

      return userDeleted;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  async updatePassword({ userId, oldPassword, newPassword }) {
    const transaction = await User.sequelize.transaction();

    try {
      const user = await User.findOne({
        where: {
          id: userId,
          is_deleted: false,
        },
        attributes: ["id", "password"],
        raw: false,
      });

      if (!user) {
        throw new ExceptionUtils("NOT_FOUND");
      }

      const isOldPasswordValid = this.isValidPassword(oldPassword, user.password);

      if (!isOldPasswordValid) {
        return false;
      }

      const hashedNewPassword = await bcrypt.hash(newPassword, 10);

      await User.update(
        { password: hashedNewPassword },
        { where: { id: userId }, transaction }
      );

      await transaction.commit();

      return true;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  isValidPassword(password, hashedPassword) {
    return bcrypt.compareSync(password, hashedPassword);
  }
}

export default UserService;
