const express = require('express'); 
const cors = require('cors');
const app = express();  



app.use(cors());
const port = 4000

app.get('/testAPI', async (req, res) => {

  const puuid = await axios.get('https://europe.api.riotgames.com/riot/account/v1/accounts/by-riot-id/' + summonerName + '/' + tagLine + '?api_key=' + apiKey)
  .then(res => res.data.puuid).
  catch(error => console.log(error))  

  console.log(puuid)
   
  res.json(puuid)
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})