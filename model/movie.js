//data= require("./data_types.js")(sequelize, Sequelize);

module.exports = (sequelize, DataTypes) => {
  const Movies = sequelize.define("movie", {
             titles: {
                type: DataTypes.STRING,
            required: true
          },

          opening_crawl: {
            type: DataTypes.STRING(1234),
            required: true
          },
          release_date: {
            type: DataTypes.DATE,
            required: true
          },
          character: {
            type: DataTypes.STRING,
            required: true
          }
          
             
    
  });




  return Movies;
};

