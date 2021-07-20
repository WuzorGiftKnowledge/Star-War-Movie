module.exports = (sequelize, DataTypes) => {
    const Comment = sequelize.define("comment", {
      name: {
        type: DataTypes.STRING
      },
      text: {
        type: DataTypes.STRING
      },
      movieId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      }
    });
  
    return Comment;
  };
  