import logo from './logo.svg';
import './App.css';
import axios from 'axios';
import React, {useState} from 'react';






function App() {


  const [message, setMessage] = useState("")
  const [summonerInput, setSummonerName] = useState("")  
  const [matchList, setMatchList] = useState([])

  function callAPI(event) {  
    

    const [summonerName, tagLine] = summonerInput.split("#");
    
    axios.get('https://tfttracker-server.vercel.app/testAPI', {params: {summonerName: summonerName, tagLine: tagLine}})  
    .then(res => setMatchList(res.data))
    .catch(error => console.log(error))

    
  }



  return (
    <div className="App">
      <header className="App-header">
       
      <input type="puuid" onChange={e => setSummonerName(e.target.value)}></input>
       <button onClick={callAPI}>Call API</button>
       {matchList.length !== 0 ?
        <>
           <p>Match History</p>
           {
             matchList.map((matchData, index) => 
               <>

                <h2> Game {index +1} </h2>
                <div>
                 {matchData.info.participants.map((data, pIndex)=>
                  <p> {data.augments}, {data.placement} </p>

                )


                 }
                </div>

               </>

             )
           }
        </>
        :
        <>
          <p>No matches found</p>

        </>


      }
      </header>
    </div>
  );
}

export default App;
