const express = require('express'); 
const cors = require('cors');
const axios = require('axios'); 
const app = express();  



app.use(cors());


const port = 4000

app.get('/testAPI', async (req, res) => {

  const summonerName = req.query.summonerName;
  const tagline = req.query.tagLine;

  await axios.get('https://europe.api.riotgames.com/riot/account/v1/accounts/by-riot-id/' + summonerName + '/' + tagLine + '?api_key=' + apiKey)
    .then(response => {
        console.log(response.data.puuid);
    }).catch(error => {
        console.log(error);
    });

   
  res.json(response.data.puuid)
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})