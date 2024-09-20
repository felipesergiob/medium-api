import { Model } from "sequelize";

export default class PostLike extends Model {
    static load(sequelize, DataTypes) {
        return super.init({
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            user_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: 'users',
                    key: 'id'
                }
            },
            post_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: 'posts',
                    key: 'id'  
                }
            },
            is_deleted: {
				type: DataTypes.BOOLEAN,
				allowNull: false,
				defaultValue: false
			}
        }, {
            timestamps: true,
            sequelize,
            modelName: 'post-likes',
            tableName: 'post_likes',
            createdAt: 'created_at',
            updatedAt: 'updated_at',
        });
    }

    static associate(models) {
        this.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
        this.belongsTo(models.Post, { foreignKey: 'post_id', as: 'post' });
    }
}
