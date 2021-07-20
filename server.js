const express = require("express");
const db = require("./model");
const controller = require("./controllers/moviesController");
const bodyParser = require("body-parser");
const { inverse, green } = require("chalk");
const _=require('lodash');

const Movie = db.movies;
const Comment = db.comments;



const port = process.env.PORT || 3001;
const request = require("request");
const fetch = require("node-fetch");
const { object } = require("joi");

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
let data;


app.get("/movies/:id", async (req, res)=> {
 if (req.params.id <1) {
  res.status(500);
    res.send({ Error: "INVALID SPECIFIED" });
  }
  try {
    const mov = await controller.findMovieById(req.params.id);

  return   res.send({Movie: JSON.stringify(mov, null, 2)});
  } catch (err) {
    return res.send({ error: "Requisition Failed", err });
  }
});



app.get("/comments/:id", async (req, res)=> {
  if (req.params.id <1) {
    res.status(500);
      res.send({ Error: "INVALID SPECIFIED" });
    }
   try {
     const com = await controller.findCommentById(req.params.id);
 
   return   res.send({Comment: JSON.stringify(com, null, 2)});
   } catch (err) {
     return res.send({ error: "Requisition Failed", err });
   }
 });


app.get("/movies", async (req, res) => {
  try {
    const mov = await controller.findAll();

    res.send({ movies: JSON.stringify(mov, null, 2) });
  } catch (err) {
    return res.send({ error: "Requisition Failed", err });
  }
});

app.get("/api/movies", async (req, res) => {
  
  try{
    const url = ["https://swapi.dev/api/films/"];

  //url.map(async (url) => {
    // try{
    const response = await fetch(url);

    let data2 = await response.json();
   // data2=_.orderBy(data2.results,['title'], ['desc']);
   // console.log (data2);
    // const data1=await JSON.parse(JSON.stringify(data2.results));
    if (data2 == null) {
      console.log(" no data returned");
    }
    var moviee=new Array();
    let mov=new object;
    var data1=[];
    for (var i = 0; i < data2.count; i++) {
     
    data1= JSON.parse(JSON.stringify(data2.results[i]));
    const commentcount = await controller.countSpecificComment(data1.episode_id);
    var count =commentcount[0];
     count=count['Commentcount'];
     mov={
        titles: data1.title,
        opening_crawl: data1.opening_crawl,
        release_date: data1.release_date,
        character: data1.character,
        comment:count,
      }
      moviee.push(mov);

} 
moviee=_.orderBy(moviee,['titles'], ['desc']);
console.log(moviee);

return   res.send({moviee});
}catch (err) {
  return res.send({ error: "Requisition Failed", err });
}
});



app.post("/comments", async (req, res) => {
  try {
  
  
    const comment = await controller.createComment(req.body.movieId, {name:req.body.name, comment:req.body.comment});
    return res.send({ Success: JSON.stringify(comment, "Comment saved", 2) });
  } catch (err) {
    return res.send({ error: "Unable to save comment", err });
  }
});

app.post("/movies", async (req, res) => {
  try {
  
  
    const movie = await controller.createComment(request.body);
    return res.send({ Success: JSON.stringify(movie, "movie saved", 2) });
  } catch (err) {
    return res.send({ error: "Unable to save cmovie", err });
  }
});





app.listen(port, () => {
  console.log(
    inverse("\n Backend:") + green(` Api listening on port ${port} ... \n`)
  );
});



  

const run = async () => {
  const url = ["https://swapi.dev/api/films/"];

  url.map(async (url) => {
    // try{
    const response = await fetch(url);

    let data2 = await response.json();
  //  data2=_.orderBy(data2.results,['title'], ['desc']);
 //   console.log (data2);
    // const data1=await JSON.parse(JSON.stringify(data2.results));
    if (data2 == null) {
      console.log(" no data returned");
    }
    for (var i = 0; i < data2.count; i++) {
      var data1 = JSON.parse(JSON.stringify(data2.results[i]));
      controller.createMovie({
        titles: data1.title,
        opening_crawl: data1.opening_crawl,
        release_date: data1.release_date,
        character: data1.character,
      });
    }
   
  });

  

  const mov1 = await controller.createMovie({
    titles: "Snake in the eages shadow",
    opening_crawl: "Snakw in eagles shadow Description",
    character: "James Peter",
  });

  const mov2 = await controller.createMovie({
    title: "Mr. Ibu",
    opening_crawl: "Mr. Ibu Description",
    character: "mathew Peter",
  });

  const comment1 = await controller.createComment(mov1.id, {
    name: "bezkoder",
    text: "Good job!",
  });

  await controller.createComment(mov1.id, {
    name: "zkoder",
    text: "One of the best movies!",
  });

  const comment2 = await controller.createComment(mov2.id, {
    name: "aKoder",
    text: "Hi, thank you!",
  });

  await controller.createComment(mov2.id, {
    name: "anotherKoder",
    text: "Awesome movie!",
  });

  const mov1Data = await controller.findMovieById(mov1.id);
  console.log(">> Movie id=" + mov1Data.id, JSON.stringify(mov1Data, null, 2));

  const mov2Data = await controller.findMovieById(mov2.id);
  console.log(">> Movie id=" + mov2Data.id, JSON.stringify(mov2Data, null, 2));

  const comment1Data = await controller.findCommentById(comment1.id);
  console.log(
    ">> Comment id=" + comment1.id,
    JSON.stringify(comment1Data, null, 2)
  );

  const comment2Data = await controller.findCommentById(comment2.id);
  console.log(
    ">> Comment id=" + comment2.id,
    JSON.stringify(comment2Data, null, 2)
  );

  const commentcount = await controller.countSpecificComment(mov1.id);
 const count =commentcount[0];
  console.log(count['Commentcount']);


  const movies = await controller.findAll();
  console.log(">> All movies", JSON.stringify(movies, null, 2));



};



db.sequelize.sync({ force: true }).then(() => {
  console.log("Drop and re-sync db.");
  run();
});
