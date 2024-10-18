const express = require('express'); 
const cors = require('cors');
const axios = require('axios'); 
const app = express();  



app.use(cors());

const APIKEY = 'RGAPI-7a0a67e0-9476-42be-8a98-ecb531eef305'
const port = 4000

app.get('/testAPI', async (req, res) => {

  const summonerName = req.query.summonerName;
  const tagLine = req.query.tagLine;

  const puuid = await axios.get('https://europe.api.riotgames.com/riot/account/v1/accounts/by-riot-id/' + summonerName + '/' + tagLine + '?api_key=' + APIKEY)
    .then(response => {
        console.log(response.data.puuid);
        return response.data.puuid; 
    }).catch(error => {
        console.log(error);
    });

   

  res.json(puuid)
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})