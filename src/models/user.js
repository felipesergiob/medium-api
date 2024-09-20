import BaseModel from "./base";

export default class User extends BaseModel {

    static load (sequelize, DataTypes) {
        return super.init({
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            name: {
                type: DataTypes.STRING,
                allowNull: false
            },
            email: {
                type: DataTypes.STRING,
                allowNull: false
            },
            password: {
                type: DataTypes.STRING,
                allowNull: false
            }, 
            is_deleted: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: false
            }
        } , {
            timestamps: true,
            sequelize,
            modelName: 'user',
            tableName: 'users',
            created_at: 'created_at',
            updated_at: 'updated_at',
        });
    }

    static associate (models) {
        this.hasMany(models.Post, { foreignKey: 'user_id', as: 'posts' });
        this.hasMany(models.PostLike, { foreignKey: 'user_id', as: 'post_likes' });
    }
            
}
