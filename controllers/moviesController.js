const db = require("../model");
const Sequelize = require("sequelize");
const Movie = db.movies;
const Comment = db.comments;








// Create and Save new Movie
exports.createMovie = (movie) => {
  return Movie.create({
 
    
               titles : movie.titles,
               opening_crawl:movie.opening_crawl,
               release_date:movie.release_date,
               character:movie.character

  })
    .then((movie) => {
      console.log(">> Created MOVIE: " + JSON.stringify(movie, null, 4));
      return movie;
    })
    .catch((err) => {
      console.log(">> Error while creating movie: ", err);
    });
};





// Create and Save new Comments
exports.createComment = (movieId, comment) => {
  return Comment.create({
    name: comment.name,
    text: comment.text,
    movieId: movieId
  })
    .then((comment) => {
      console.log(">> Created comment: " + JSON.stringify(comment, null, 4));
      return comment;
    })
    .catch((err) => {
      console.log(">> Error while creating comment: ", err);
    });
};

// Get the comments for a given tutorial
exports.findMovieById = (movieId) => {
  return Movie.findByPk(movieId, { include: [Comment] })
    .then((movies) => {
      return movies;
  })  
    .catch((err) => {
      console.log(">> Error while finding movie: ", err);
    });
};

// Get the comments for a given comment id
exports.findCommentById = (id) => {
  return Comment.findByPk(id, { include: [Movie] })
    .then((comment) => {
      return comment;
    })
    .catch((err) => {
      console.log(">> Error while finding comment: ", err);
    });
};

// Get all Movies include comments
exports.findAll = () => {
  return Movie.findAll({
    include: [Comment],
  }).then((movies) => {
    return movies;
  });
};

// Get all counts of  comments
exports.countSpecificComment = ( movieId) => {
 return Comment.findAll({ where:{movieId:movieId},
    attributes: 
       ['movieId', [Sequelize.fn("COUNT", Sequelize.col("movieId")), "Commentcount" ]],
     raw:true,
}) .then((commentCount) => {
  console.log(commentCount);
  return commentCount;
})
.catch((err) => {
  console.log(">> Error while finding comment: ", err);
});
 
 /// return Movie.findAndCountAll({include:["comments"]
  
 // });
};



