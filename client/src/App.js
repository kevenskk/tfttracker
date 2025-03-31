import logo from './logo.svg';
import './App.css';
import tactician from './tft-tactician.json';


import axios from 'axios';
import React, {useState, useEffect} from 'react';



function App() {


  const [input, setInput]= useState("")  // input for summoner search

  const [matchList, setMatchList] = useState([]) // store match data
  const [puuid, setPuuid] = useState("")  

  const [rankedData, setRankedData] = useState([]) // store ranked data
  const [summonerData, setSummonerData] = useState([]) // store summoner data
  // path to localhost 
  const mData = 'http://localhost:4000/matchData';

  const sData = 'http://localhost:4000/summonerData'; 

  const rData = 'http://localhost:4000/rankedData'; 


  // path to vercel

  const mDataVercel = 'https://tfttracker-server.vercel.app/matchData';  

  const sDataVercel = 'https://tfttracker-server.vercel.app/summonerData'; 

  const rDataVercel = 'https://tfttracker-server.vercel.app/rankedData'; 

  


  

  function getPlayerData(event) {  
    
    const [summonerName, tagLine] = input.split("#");

   
    
    axios.get(mDataVercel, {params: {summonerName: summonerName, tagLine: tagLine}})  
    .then(res => setMatchList(res.data))
    .catch(error => console.log(error))
     
    axios.get(sDataVercel, {params: {summonerName: summonerName, tagLine: tagLine}})  
    .then(res => setSummonerData(res.data)
    )
    .catch(error => console.log(error))

    axios.get(rDataVercel, {params: {summonerName: summonerName, tagLine: tagLine}})
    .then(res => {
      console.log("Ranked Data Response:", res.data); // Debugging
      setRankedData(res.data);
    })
    .catch(error => console.log(error));

    
                 
  }

  

  function secondsToMinute(seconds){
     let minutes = Math.floor(seconds/60);  
     let remainingSeconds = Math.floor(seconds % 60);
  
     return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`; // Format as MM:SS
    }

  

    function unixToDate(unixTimestamp) {

      const date = new Date(unixTimestamp);
      
      return date.toUTCString();
      
    }
    

    function getTacticianImage(tacticianID){
    
    
      const response = tactician;

      
      console.log(response.data[tacticianID].image.full); // Debugging
  
      return response.data[tacticianID].image.full;
    }

  return (
    <div className="App">
         
      <header className="App-header">
      <div className = "search">  <input type="puuid" placeholder="Search Player#Tag(EUW)" onChange={e => setInput(e.target.value)}></input>
        <button onClick={getPlayerData}>Search</button>

        <button onClick={getTacticianImage}> Tactician </button>
       
        
        </div>
      </header>
       
    
       
      <>
  {summonerData.profileIconId ? (
    <>

       <div className="summonerInfo">
      <img src={"https://ddragon.leagueoflegends.com/cdn/15.5.1/img/profileicon/" + summonerData.profileIconId +".png"}
        alt="Profile icon"
        width="100"
        height="100"/>

     

      
      
      </div>
       <div className = "rankInfo">
      <img src={"https://tfttracker-server.vercel.app/assets/" + rankedData.tier + ".png" } width="100"  height="100" alt= {rankedData.tier} />

      <p> Rank: {rankedData.tier} {rankedData.rank} </p>
      <p> Wins: {rankedData.wins} Loss: {rankedData.losses}    </p>
      <p> Top 4 Rate: {rankedData.wins} </p>
      <p> Win Rate: {((rankedData.wins / (rankedData.wins + rankedData.losses)) * 100).toFixed(1)}%</p>      
      <p> Games: {(rankedData.wins) + (rankedData.losses)}</p>

      </div>
    </>
  ) : (
    console.log("No data available")
  )}
</>




      
        <React.Fragment>
        
           {
             matchList.map((matchData, index) => 
               <React.Fragment key ={index}>
                


                
                 
                <p> {unixToDate(matchData.info.game_datetime)} </p>

                <p>{secondsToMinute(matchData.info.game_length)}  </p>
                 
                <div className = "matchInfo">
                <table className= "matchTable">


                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Tactitian</th>
                      <th>Player</th>
                      <th>Units</th>
                    </tr>
                  </thead>

                  <tbody>
                {matchData.info.participants
            .sort((a, b) => a.placement - b.placement) // Sort participants by placement
            .map((data, pIndex) => (


            
             
              <tr key={pIndex}>
              <td>{data.placement}</td>
              <td> 
                
                <img src={"https://tfttracker-server.vercel.app/assets/" + rankedData.tier + ".png"} alt="Tactician" width="50" height="50" />
                
                
              </td>
              <td>{data.riotIdGameName}</td>
              <td>

                
                {data.units.map((unit, unitIndex) => (
                  <span key={unitIndex}>{unit.character_id}</span>
                ))}
              </td>
            </tr>
             ))}
            </tbody>
            </table>
          </div>
         </React.Fragment>
             )
           }
        </React.Fragment>

     
      
    </div>
  );
}

export default App;
