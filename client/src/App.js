import logo from './logo.svg';
import './App.css';
import tactician from './tft-tactician.json';
import champion from './tft-champion.json';


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

      
      //console.log(response.data[tacticianID].image.full); // Debugging
  
      return response.data[tacticianID].image.full;
    }
    
   

    function getChampionImage(championID){


      try{

        const response = champion; // import tft-champion.json
    
    

        const championIDString = championID.toString();
  
        const first3Chars = championIDString.substring(0, 3);
  
        const first3CharsCapitalized = first3Chars.toUpperCase(); 
              
        const remainingLetters = championIDString.slice(3);
        
        const seventhChar = remainingLetters.charAt(3).toUpperCase() + remainingLetters.slice(4); // Capitalize the 7th character
  
        const championIDPath = first3CharsCapitalized + remainingLetters.slice(0,3) + seventhChar; // Capitalize the 7th character
        
        console.log(championIDPath); // Debugging
  
  
      //  console.log(response.data['Maps/Shipping/Map22/Sets/TFTSet13/Shop/' + championIDPath].image.full); // Debugging
       
        return response.data['Maps/Shipping/Map22/Sets/TFTSet13/Shop/' + championIDPath].image.full;

        

      }catch (error){
         
        

        console.error("Error fetching champion image:", error);
      } 
      
    } 
   




  return (
    <div className="App">
         
      <header className="App-header">
      <div className = "search">  <input type="puuid" placeholder="Search Player#Tag(EUW)" onChange={e => setInput(e.target.value)}></input>
        <button onClick={getPlayerData}>Search</button>

        <button onClick={getChampionImage}>Champion</button>
         

       
        
        </div>
      </header>
       
    
       
      <>
  {summonerData.profileIconId ? (
    <>

       <div className="summonerInfo">
      <img src={"https://ddragon.leagueoflegends.com/cdn/15.6.1/img/profileicon/" + summonerData.profileIconId +".png"}
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
                      <th>Tactician</th>
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
                
                <img src={"https://ddragon.leagueoflegends.com/cdn/15.6.1/img/tft-tactician/" + getTacticianImage(data.companion.item_ID)} alt="Tactician" width="50" height="50" />
                
                
              </td>
              <td>{data.riotIdGameName}</td>
              <td>
                

                

              {data.units.map((units, unitIndex) => {
              const championImageSrc = units.character_id === "TFT13_Sion" ? "https://ddragon.leagueoflegends.com/cdn/15.6.1/img/champion/Sion.png"
              : 
              "https://ddragon.leagueoflegends.com/cdn/15.6.1/img/tft-champion/" + getChampionImage(units.character_id);
              return (
                <img
                  key={unitIndex}
                  src={championImageSrc}
                  alt={`Champion ${units.character_id || "Unknown"}`}
                  width="50"
                  height="50"
                />
              );
            })}
 
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
