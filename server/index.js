const express = require('express'); 
const cors = require('cors');
const axios = require('axios'); 
const app = express();  
require('dotenv').config();



app.use(cors());

app.use('/assets', express.static(__dirname + '/assets')) // Serve static files from the public directory


//app.use('/assets/tft-champion', express.static(__dirname + '/assets/tft-champion')) // Serve static files from the public directory

//app.use('/assets/tft-tactician', express.static(__dirname + '/assets/tft-tactician')) // Serve static files from the public directory


const apiKey = process.env.apiKey;

const port = 4000

function getPUUID(summonerName, tagLine){
   
  return axios.get('https://europe.api.riotgames.com/riot/account/v1/accounts/by-riot-id/' + summonerName + '/' + tagLine + '?api_key=' + apiKey)
  .then(response => {
   //   console.log(response.data);
      return response.data.puuid;
  }).catch(error => {
      console.log(error);
  });

}




function getRiot(PUUID){
   

  return axios.get('https://europe.api.riotgames.com/riot/account/v1/accounts/by-puuid/' + PUUID + '?api_key=' + apiKey)
  .then(response => {
    //  console.log(response.data.gameName);
      return response.data.gameName;
  }).catch(error => {
      console.log(error);
  });


}

function getSummonerID(PUUID){




  return axios.get('https://euw1.api.riotgames.com/tft/summoner/v1/summoners/by-puuid/' + PUUID + '?api_key=' + apiKey)
  .then(response => {
  //    console.log(response.data.id);
      return response.data.id;
    }).catch(error => {
      console.log(error);
  });

}


app.get('/matchData', async (req, res, next) => {
  
  const summonerName = req.query.summonerName;
  const tagline = req.query.tagLine;


  const puuid = await getPUUID(summonerName, tagline);

   // return 10 matches only
  const matchIDs = await axios.get('https://europe.api.riotgames.com/tft/match/v1/matches/by-puuid/' + puuid + '/ids?start=0&count=10&api_key=' + apiKey)
  .then(response => response.data)
  .catch(err => err)
  

      console.log(matchIDs);

      var matchList = [];

      for(var i = 0; i < matchIDs.length; i++){ 
          const matchID = matchIDs[i];
          const matchData = await axios.get('https://europe.api.riotgames.com/tft/match/v1/matches/' + matchID + '?api_key=' + apiKey)
          .then(response => response.data)
          .catch(err => err)
           
          




        //console.log(matchData.info.participants[0].units.map(units => units.character_id)); // log placement of first participant

           
           
        
         
         // console.log(matchData);


          matchList.push(matchData);

      }
      
     

      
      res.json(matchList); // Send the JSON response back to the client */
      

  
});






app.get('/summonerData', async (req, res, next) => {
    
     const summonerName = req.query.summonerName;
     const tagline = req.query.tagLine
 
     const puuid = await getPUUID(summonerName, tagline);

      

     
  //  console.log(puuid);

  

     const summonerData = await axios.get('https://euw1.api.riotgames.com/tft/summoner/v1/summoners/by-puuid/' + puuid + '?api_key=' + apiKey)
     .then(response => response.data)
     .catch(err => err)
     
    //console.log(summonerData); 


     
    res.json(summonerData); // Send the JSON response back to the client */
    
  
});

app.get('/rankedData', async (req, res, next) => {
    
  const summonerName = req.query.summonerName;
  const tagline = req.query.tagLine

  const puuid = await getPUUID(summonerName, tagline);

   

  
 //console.log(puuid);

 
 const summonerID = await getSummonerID(puuid)

  const rankedData = await axios.get('https://euw1.api.riotgames.com/tft/league/v1/entries/by-summoner/' + summonerID + '?api_key=' + apiKey)
  .then(response => response.data).catch(err => err)



  const tftRankedData = rankedData.find(queue => queue.queueType === "RANKED_TFT");


  
 res.json(tftRankedData); // Send the JSON response back to the client */ 
 
 console.log(tftRankedData); // Debugging

});





app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})