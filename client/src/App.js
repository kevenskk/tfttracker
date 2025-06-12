import logo from './logo.svg';
import './App.css';
import axios from 'axios';
import React, {useState, useEffect} from 'react';



function App() {


  const [input, setInput]= useState("")  // input for summoner search

  const [matchList, setMatchList] = useState([]) // store match data
  

  const [rankedData, setRankedData] = useState([]) // store ranked data
  const [summonerData, setSummonerData] = useState([]) // store summoner data
  const [server, setServer] = useState("europe"); // store server data


  const [championJson, setChampionJSON] = useState(null);
  const [currentChampionJson, setCurrentChampionJSON] = useState(null);
  const [tacticianJSON, setTacticianJSON] = useState(null);
  const [latestPatch, setLatestPatchVersion] = useState(null);

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
    
   
    
    axios.get(mDataVercel, {params: {summonerName: summonerName, tagLine: tagLine, server: server}})  
    .then(res => setMatchList(res.data))
    .catch(error => console.log(error))
     
    axios.get(sDataVercel, {params: {summonerName: summonerName, tagLine: tagLine, server: server}})  
    .then(res => setSummonerData(res.data)
    )
    .catch(error => console.log(error))

    axios.get(rDataVercel, {params: {summonerName: summonerName, tagLine: tagLine, server: server}})
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
      try{

       // console.log(tacticianID);
       //  console.log(response.data[tacticianID].image.full); // Debugging
  
        return tacticianJSON.data[tacticianID].image.full;

      }catch(error){
        console.error("Error fetching tactician image:", error);

         


      }
      
    }

  
    useEffect(() => {

     
        
      async function fetchJSON(){

       try{
           const Patchresponse = await fetch('https://ddragon.leagueoflegends.com/api/versions.json');

           const latestPatchVersion = await Patchresponse.json(); 

           setLatestPatchVersion(latestPatchVersion[0]); // Set the latest patch version

           console.log(latestPatchVersion[0]); // Debugging


           const Set13 = await fetch('https://ddragon.leagueoflegends.com/cdn/15.6.1/data/en_GB/tft-champion.json');

           

           const CurrentSet = await fetch('https://ddragon.leagueoflegends.com/cdn/'+latestPatchVersion[0]+'/data/en_GB/tft-champion.json');

           const tacticianResponse = await fetch('https://ddragon.leagueoflegends.com/cdn/'+latestPatchVersion[0]+'/data/en_GB/tft-tactician.json');

          

           if(!Set13.ok || !CurrentSet.ok || !tacticianResponse.ok){
             throw new Error("Could not fetch the requested JSON:" + Set13.status + " " + CurrentSet.status + " " + tacticianResponse.status);
   
   
           }
          
          
   
           const Set13JSON = await Set13.json();
           const CurrentSetJSON = await CurrentSet.json(); // retrieve the current set's champion data/assets
           const tactician = await tacticianResponse.json();
           
           
           setChampionJSON(Set13JSON);
           setCurrentChampionJSON(CurrentSetJSON);
           setTacticianJSON(tactician);
           
           

         
        }catch(error){
          console.error("Error fetching JSON data:", error);
   
        }
   
       }
       
       fetchJSON();

    }, [])

   


    // Function to get the champion image based on the champion ID
    
   function getChampionImage(championID){

      try{


        const first3Chars = championID.substring(0, 3);
  
        const first3CharsCapitalized = first3Chars.toUpperCase(); 
                
        const remainingLetters = championID.slice(3);
          
        const seventhChar = remainingLetters.charAt(3).toUpperCase() + remainingLetters.slice(4); // Capitalize the 7th character
    
        const championIDPath = first3CharsCapitalized + remainingLetters.slice(0,3) + seventhChar; 


    
        if(championIDPath.includes('TFT14') ){
          return currentChampionJson.data['Maps/Shipping/Map22/Sets/TFTSet14/Shop/' + championIDPath].image.full;
             


        } else if(championIDPath.includes('TFT13')){
          console.log(championIDPath);
          return championJson.data['Maps/Shipping/Map22/Sets/TFTSet13/Shop/' + championIDPath].image.full;
          
          
        }
       



      }catch (error){
         
        
       
        console.error("Error fetching champion image:", error);
      } 
      
        
       

    
      
      
    } 


    function getTraitImage(traitID){
        
    }
  

  return (
    <div className="App">


          <header className= "App-header">
          
          <div className = "search">  <input type="puuid" placeholder="Search Player#Tag and select Region" onChange={e => setInput(e.target.value)}></input>
          <button onClick={getPlayerData}>Search</button>
          <select value={server} onChange={e => setServer(e.target.value)}>
            <option value="europe" selected>EUW</option>
            <option value="americas" selected>NA</option>

          </select> 
          </div>
          
          </header>
       
      <>
  {summonerData.profileIconId ? (
    <>
       <div className = "rankInfo">
       <img src={"https://ddragon.leagueoflegends.com/cdn/"+latestPatch+"/img/profileicon/" + summonerData.profileIconId +".png"}
        alt="Profile icon"
        width="100"
        height="100"/>
      
      
      {rankedData.tier ? (
    <img
      src={
        "https://tfttracker-server.vercel.app/assets/" +
        rankedData.tier +
        ".png"
      }
      width="100"
      height="100"
      alt={rankedData.tier}
    />
  ) : (
    <img
      src="https://tfttracker-server.vercel.app/assets/unranked.png" // Fallback image for unranked players
      width="100"
      height="100"
      alt="Unranked"
    />
  )}
       
      
          {rankedData.tier && rankedData.rank ? (
      <p>
        {rankedData.tier} {rankedData.rank} {rankedData.leaguePoints} LP
      </p>
    ) : (
      <p> Unranked</p>
    )}
      
      <p> Wins: {rankedData.wins}     </p>
      <p> Losses:  {rankedData.losses}</p>
      
    

      
     

      {rankedData.wins || rankedData.losses ? (
    <p>
      <p> Win Rate: {((rankedData.wins / (rankedData.wins + rankedData.losses)) * 100).toFixed(1)}%</p>      
      </p>
  
     ) : (
     <p>  Win Rate: {0} </p>
    )}


      {rankedData.wins || rankedData.losses ? (
    <p>
      Games:  {(rankedData.wins) + (rankedData.losses)}
    </p>
  
    ) : (
     <p> Games: {0} </p>
    )}
  
     <p> Avg. Placement
      
     </p>

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
          
                
                 
                <div className = "matchInfo">
                  
                <div className = "gametime">     
                <p> {unixToDate(matchData.info.game_datetime)} </p>
                <p>  Game Duration: {secondsToMinute(matchData.info.game_length)} </p>
                </div>
           
                

                <table className= "matchTable" >
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Tactician</th>
                      <th>Player</th>
                      <th>Eliminated</th>
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
                 <div className ='tactician'>   <img src={"https://ddragon.leagueoflegends.com/cdn/"+latestPatch+"/img/tft-tactician/" + getTacticianImage(data.companion.item_ID)} 
                alt="Tactician" width="64" height="64" /> </div>  
                
              </td>
              <td>{data.riotIdGameName}</td>
              <td> {secondsToMinute(data.time_eliminated)}</td>

              <td>
              <div className = 'units'>
              {data.units.map((units, unitIndex) => {
              const championImageSrc = units.character_id === "TFT13_Sion" 
              ? "https://ddragon.leagueoflegends.com/cdn/15.6.1/img/champion/Sion.png"
              : units.character_id === "TFT13_JayceSummon"
              ? "https://tfttracker-server.vercel.app/assets/TFT13_JayceSummon.png"
              : units.character_id === "TFT13_Viktor"
              ? "https://ddragon.leagueoflegends.com/cdn/15.6.1/img/champion/Viktor.png"
              : units.character_id === "TFT13_MissMage"
              ? "https://ddragon.leagueoflegends.com/cdn/15.6.1/img/champion/Mel.png"
              : units.character_id === "TFT13_Warwick"
              ? "https://tfttracker-server.vercel.app/assets/TFT13_Warwick.png"
              : units.character_id.includes('TFT13') || units.character_id.includes('tft13')
              ? "https://ddragon.leagueoflegends.com/cdn/15.6.1/img/tft-champion/" + getChampionImage(units.character_id)
              : units.character_id.includes('TFT14_Summon_Turret')
              ? "https://tfttracker-server.vercel.app/assets/TFT14_Summon_Turret.png"
              :
              "https://ddragon.leagueoflegends.com/cdn/15.7.1/img/tft-champion/" + getChampionImage(units.character_id);
              return (
                <img
                  key={unitIndex}
                  src={championImageSrc}
                  alt={`${units.character_id || "Unknown"}`}
                  width="64"
                  height="64"
                  
                />
              );
            })}
                </div>
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
