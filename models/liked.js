'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class liked extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.User, {
        targetKey: 'id',
        foreignKey: 'userId',
      });
      this.belongsTo(models.Post, {
        targetKey: 'id',
        foreignKey: 'postId',
      });
    }
  }
  liked.init(
    {
      userId: DataTypes.INTEGER,
      postId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: 'liked',
    }
  );
  return liked;
};
