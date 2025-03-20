import logo from './logo.svg';
import './App.css';
import axios from 'axios';
import React, {useState, useEffect} from 'react';








function App() {


  const [input, setInput]= useState("")  // input for summoner search

  const [matchList, setMatchList] = useState([]) // store match data
  const [puuid, setPuuid] = useState("")  




  function returnMatchList(event) {  
    

    const [summonerName, tagLine] = input.split("#");
    

    // path to localhost api

    const localhost = 'http://localhost:4000/testAPI';

    // path to vercel api

    const vercelhost = 'https://tfttracker-server.vercel.app/testAPI';  
    
    axios.get(vercelhost, {params: {summonerName: summonerName, tagLine: tagLine}})  
    .then(res => setMatchList(res.data))
    .catch(error => console.log(error))
     
                 
    
  }






  

 
   

  
  



  function secondsToMinute(seconds){
     let minutes = Math.floor(seconds/60);  
     let remainingSeconds = Math.floor(seconds % 60);
  
     return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`; // Format as MM:SS
    }

  return (
    <div className="App">
      <header className="App-header">
       
      <input type="puuid" onChange={e => setInput(e.target.value)}></input>
       <button onClick={returnMatchList}>Call API</button>

       

       
       {matchList.length !== 0 ?
        <>
           <p>Match History</p>
           {
             matchList.map((matchData, index) => 
               <>

                <h2> Game {index +1} </h2>
                <div>
                 {matchData.info.participants.map((data, pIndex)=>
                  <p>  {data.placement}, {data.companion.species}, {secondsToMinute(data.time_eliminated)} </p>

                 
                 
                 
                )}
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
