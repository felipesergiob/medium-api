'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.renameColumn('post_likes', 'deleted_at', 'is_deleted');
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.renameColumn('post_ikes', 'is_deleted', 'deleted_at');
  }
};
