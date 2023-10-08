//Required packages
const express = require("express");
const fetch = require("node-fetch");

require("dotenv").config();

//Create the express server
const app = express();

//Server port number
const PORT = process.env.PORT || 3000;

//Set template engine
app.set("view engine", "ejs");
app.use(express.static('public'));

//Needed to parse HTML data for POST request
app.use(express.urlencoded({
    extended: true
}));
app.use(express.json());

app.get("/", (req, res) => {
    res.render("index")
})

//Convert2MP3
app.post("/convert-mp3", async (req, res) => {

    const videoId = req.body.videoId;
    
    if(
      videoId === undefined ||
      videoId === "" ||
      videoId === null
    ){
      return res.render("index", { success : false, message : "Please enter a video ID"});
    } else {
        const fetchAPI = await fetch(`https://youtube-mp36.p.rapidapi.com/dl?id=${videoId}`, {
        "method": "GET",
        "headers": {
          "x-rapidapi-key": process.env.API_KEY,
          "x-rapidapi-host": process.env.API_HOST
        }
        });
        const fetchAPI4 = await fetch(`https://ytstream-download-youtube-videos.p.rapidapi.com/dl?id=${videoId}`, {
        "method": "GET",
        "headers": {
          "x-rapidapi-key": process.env.API_KEY4,
          "x-rapidapi-host": process.env.API_HOST4
          }
        });
  
      const fetchResponse = await fetchAPI.json();
      const fetchResponse4 = await fetchAPI4.json();
   
      if(fetchResponse.status === "ok"){
        return res.render("index",{ success : true,  song_title : fetchResponse.title, song_link : fetchResponse.link, song_link4 : fetchResponse4.formats[1].url})
      }else
        return res.render("index", { success : false, message : fetchResponse.msg});
    }

});


//Start the server
app.listen(PORT, ()=>{
    console.log(`Server started on port ${PORT}`);
})

