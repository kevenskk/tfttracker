const express = require('express'); 
const cors = require('cors');
const app = express();  



app.use(cors());
const port = 4000

app.get('/testAPI', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})