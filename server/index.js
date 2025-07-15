const express = require('express'); 
const cors = require('cors');
const axios = require('axios'); 
const app = express();  
require('dotenv').config();

const apiKey = process.env.apiKey;

const port = 4000

app.use(cors());

app.use('/assets', express.static(__dirname + '/assets')) // Serve static files from the public directory





function getPUUID(summonerName, tagLine, server) {
   
  return axios.get('https://'+server+'.api.riotgames.com/riot/account/v1/accounts/by-riot-id/' + summonerName + '/' + tagLine + '?api_key=' + apiKey)
  .then(response => {
   //   console.log(response.data);
      return response.data.puuid;
  }).catch(error => {
      console.log(error);
  });

}



app.get('/test', async(req,res,next) => {
    
    //  http://localhost:4000/test?summonerName=concernedape&tagLine=0001&server=europe


     const summonerName = req.query.summonerName;
     const tagline = req.query.tagLine
     const server = req.query.server;
 
     const puuid = await getPUUID(summonerName, tagline, server);
     

      switch(server){

      case 'europe':
        region = 'euw1'
        break;
      case 'americas':
        region = 'na1'
        break;
    
      
     }

      


    

     const summonerData = await axios.get('https://'+region+'.api.riotgames.com/tft/summoner/v1/summoners/by-puuid/' + puuid + '?api_key=' + apiKey)
     .then(response => response.data)
     .catch(err => err)
     
    //console.log(summonerData); 

     

        res.status(200).json(summonerData)


        
      
      




})



app.get('/matchData', async (req, res, next) => {
  
  const summonerName = req.query.summonerName;
  const tagline = req.query.tagLine;
  const server = req.query.server; 


  const puuid = await getPUUID(summonerName, tagline, server);

   // return 10 matches only
  const matchIDs = await axios.get('https://'+server+'.api.riotgames.com/tft/match/v1/matches/by-puuid/' + puuid + '/ids?start=0&count=5&api_key=' + apiKey)
  .then(response => response.data)
  .catch(err => err)
  

      //console.log(matchIDs);

      var matchList = [];

      for(var i = 0; i < matchIDs.length; i++){ 
          const matchID = matchIDs[i];
          const matchData = await axios.get('https://'+server+'.api.riotgames.com/tft/match/v1/matches/' + matchID + '?api_key=' + apiKey)
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
     const server = req.query.server;
 
     const puuid = await getPUUID(summonerName, tagline, server);
     
      

     
  //  console.log(puuid);

     switch(server){

      case 'europe':
        region = 'euw1'
        break;
      case 'americas':
        region = 'na1'
        break;
    
      
     }

  

     const summonerData = await axios.get('https://'+region+'.api.riotgames.com/tft/summoner/v1/summoners/by-puuid/' + puuid + '?api_key=' + apiKey)
     .then(response => response.data)
     .catch(err => err)
     
    //console.log(summonerData); 


  
    res.json(summonerData); // Send the JSON response back to the client */
    
  
});

app.get('/rankedData', async (req, res, next) => {
    
  const summonerName = req.query.summonerName;
  const tagline = req.query.tagLine
  const server = req.query.server;

  const puuid = await getPUUID(summonerName, tagline, server);

   

  
 //console.log(puuid);

 switch(server){

      case 'europe':
        region = 'euw1'
        break;
      case 'americas':
        region = 'na1'
        break;
      

      
     }

  //const summonerID = await getSummonerID(puuid,region)

  const rankedData = await axios.get('https://'+region+'.api.riotgames.com/tft/league/v1/by-puuid/' + puuid + '?api_key=' + apiKey)
  .then(response => response.data).catch(err => err)


  console.log(rankedData); // Debugging 
  const tftRankedData = rankedData.find(queue => queue.queueType === "RANKED_TFT");
  

  
  res.json(tftRankedData); // Send the JSON response back to the client */ 
 
 //console.log(tftRankedData); // Debugging

});







app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

