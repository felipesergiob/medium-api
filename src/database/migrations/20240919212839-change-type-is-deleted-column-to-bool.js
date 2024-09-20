'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.addColumn('posts', 'is_deleted_temp', {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
      }, { transaction });

      await queryInterface.addColumn('users', 'is_deleted_temp', {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
      }, { transaction });

      await queryInterface.addColumn('post_likes', 'is_deleted_temp', {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
      }, { transaction });

      await queryInterface.sequelize.query(`
        UPDATE "posts" SET "is_deleted_temp" = CASE WHEN "is_deleted" IS NOT NULL THEN true ELSE false END;
      `, { transaction });

      await queryInterface.sequelize.query(`
        UPDATE "users" SET "is_deleted_temp" = CASE WHEN "is_deleted" IS NOT NULL THEN true ELSE false END;
      `, { transaction });

      await queryInterface.sequelize.query(`
        UPDATE "post_likes" SET "is_deleted_temp" = CASE WHEN "is_deleted" IS NOT NULL THEN true ELSE false END;
      `, { transaction });

      await queryInterface.removeColumn('posts', 'is_deleted', { transaction });
      await queryInterface.removeColumn('users', 'is_deleted', { transaction });
      await queryInterface.removeColumn('post_likes', 'is_deleted', { transaction });

      await queryInterface.renameColumn('posts', 'is_deleted_temp', 'is_deleted', { transaction });
      await queryInterface.renameColumn('users', 'is_deleted_temp', 'is_deleted', { transaction });
      await queryInterface.renameColumn('post_likes', 'is_deleted_temp', 'is_deleted', { transaction });

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  },

  async down (queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.addColumn('posts', 'is_deleted', {
        type: Sequelize.DATE,
        allowNull: true
      }, { transaction });

      await queryInterface.addColumn('users', 'is_deleted', {
        type: Sequelize.DATE,
        allowNull: true
      }, { transaction });

      await queryInterface.addColumn('post_likes', 'is_deleted', {
        type: Sequelize.DATE,
        allowNull: true
      }, { transaction });

      await queryInterface.removeColumn('posts', 'is_deleted_temp', { transaction });
      await queryInterface.removeColumn('users', 'is_deleted_temp', { transaction });
      await queryInterface.removeColumn('post_likes', 'is_deleted_temp', { transaction });

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }
};
