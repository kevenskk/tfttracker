const express = require('express'); 
const cors = require('cors');
const axios = require('axios'); 
const app = express();  
require('dotenv').config();



app.use(cors());



const apiKey = process.env.apiKey;

const port = 4000

function getPUUID(summonerName, tagLine){
   
  return axios.get('https://europe.api.riotgames.com/riot/account/v1/accounts/by-riot-id/' + summonerName + '/' + tagLine + '?api_key=' + apiKey)
  .then(response => {
      console.log(response.data);
      return response.data.puuid;
  }).catch(error => {
      console.log(error);
  });

}

function getRiot(PUUID){
   

  return axios.get('https://europe.api.riotgames.com/riot/account/v1/accounts/by-puuid/' + PUUID + '?api_key=' + apiKey)
  .then(response => {
      console.log(response.data.gameName);
      return response.data.gameName;
  }).catch(error => {
      console.log(error);
  });


}




app.get('/testAPI', async (req, res, next) => {
  
  const summonerName = req.query.summonerName;
  const tagline = req.query.tagLine;


  const puuid = await getPUUID(summonerName, tagline);
   
  const matchIDs = await axios.get('https://europe.api.riotgames.com/tft/match/v1/matches/by-puuid/' + puuid + '/ids?start=0&count=1&api_key=' + apiKey)
  .then(response => response.data)
  .catch(err => err)
  

  // console log match ids from puuid
  console.log(matchIDs);

      var matchList = [];

      for(var i = 0; i < matchIDs.length; i++){ // return 5 matches only
          const matchID = matchIDs[i];
          const matchData = await axios.get('https://europe.api.riotgames.com/tft/match/v1/matches/' + matchID + '?api_key=' + apiKey)
          .then(response => response.data)
          .catch(err => err)
           
              
          
          console.log(matchData);

            
           
           
        
         


          matchList.push(matchData);

      }
      
     


      res.json(matchList); // Send the JSON response back to the client */
  
});


app.get('/puuid', async (req, res, next) => {
  


     const puuid = req.query.puuid;

     const gameName = await axios.get("https://europe.api.riotgames.com/riot/account/v1/accounts/by-puuid/" + puuid + "?api_key=" + apiKey)
     .then(response => response.data.gameName).
     catch(err => err);




      res.json(gameName); // Send the JSON response back to the client */
  
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})