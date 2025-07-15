const express = require('express'); 
const cors = require('cors');
const axios = require('axios'); 
const mongoose = require('mongoose');

const rateLimit = require('express-rate-limit'); // Import rate limiting middleware



const app = express();  
require('dotenv').config();

mongoose.connect(process.env.connectionString).then(() => {
    console.log('Connected to MongoDB');
}).catch(err => {
    console.error('Error connecting to MongoDB:', err);
});


const SummonerInfoSchema = new mongoose.Schema({

    
    
});

const SummonerInfoModel = mongoose.model('SummonerInfo', SummonerInfoSchema);

const limiter = rateLimit({
	windowMs: 2 * 60 * 1000, // 2 minutes
	limit: 10, // Limit each IP to 100 requests per `window` (here, per 2 minutes). MAX is 100 requests per 2 minutes.
	standardHeaders: 'draft-8', // draft-6: `RateLimit-*` headers; draft-7 & draft-8: combined `RateLimit` header
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
	ipv6Subnet: 52, // Set to 60 or 64 to be less aggressive, or 52 or 48 to be more aggressive

})


const apiKey = process.env.apiKey;

const port = 4000

app.use(cors());
app.use(limiter) // Apply the rate limiting middleware to all requests.


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


app.get('/allData', async (req, res, next) => {

   const summonerName = req.query.summonerName;
   const tagline = req.query.tagLine;
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

   // return 10 matches only
      const matchIDs = await axios.get('https://'+server+'.api.riotgames.com/tft/match/v1/matches/by-puuid/' + puuid + '/ids?start=0&count=5&api_key=' + apiKey)
      .then(response => response.data)
      .catch(err => err)
      



      var matchList = [];

      for(var i = 0; i < matchIDs.length; i++){ 
          const matchID = matchIDs[i];
          const matchData = await axios.get('https://'+server+'.api.riotgames.com/tft/match/v1/matches/' + matchID + '?api_key=' + apiKey)
          .then(response => response.data)
          .catch(err => err)
           


          matchList.push(matchData);

      }
      
     
        


      const rankedData = await axios.get('https://'+region+'.api.riotgames.com/tft/league/v1/by-puuid/' + puuid + '?api_key=' + apiKey)
      .then(response => response.data).catch(err => err)


      //  console.log(rankedData); // Debugging 
       const tftRankedData = await rankedData.find(queue => queue.queueType === "RANKED_TFT");
      
      res.json({
        matchList,
        summonerData,
        tftRankedData


      }); // Send the JSON response back to the client */
   
});



app.get('/matchData', async (req, res, next) => {
  
  const summonerName = req.query.summonerName;
  const tagline = req.query.tagLine;
  const server = req.query.server; 


  const puuid = await getPUUID(summonerName, tagline, server);

   // return 10 matches only
  const matchIDs = await axios.get('https://'+server+'.api.riotgames.com/tft/match/v1/matches/by-puuid/' + puuid + '/ids?start=0&count=5&api_key=' + apiKey)
  .then(response => response.data)
  .catch(err => err)
  



      var matchList = [];

      for(var i = 0; i < matchIDs.length; i++){ 
          const matchID = matchIDs[i];
          const matchData = await axios.get('https://'+server+'.api.riotgames.com/tft/match/v1/matches/' + matchID + '?api_key=' + apiKey)
          .then(response => response.data)
          .catch(err => err)
           


          matchList.push(matchData);

      }
      
     
      // console.log(matchList); // Debugging
      
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


  // console.log(rankedData); // Debugging 
  const tftRankedData = rankedData.find(queue => queue.queueType === "RANKED_TFT");
  

  console.log(tftRankedData)
  res.json(tftRankedData); // Send the JSON response back to the client */ 
 
 //console.log(tftRankedData); // Debugging

});







app.listen(port, () => {
  console.log(`App is listening on port ${port}`)
})

