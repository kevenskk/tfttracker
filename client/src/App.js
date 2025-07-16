import logo from './logo.svg';
import './App.css';
import axios from 'axios';
import React, {useState, useEffect} from 'react';



function App() {


  const [input, setInput]= useState("")  // input for summoner search

  const [matchList, setMatchList] = useState([]) // store match data
  const [rankedData, setRankedData] = useState([]) // store ranked data
  const [summonerData, setSummonerData] = useState([]) // store summoner data
  const [doubleUpData, setDoubleUpData] = useState([]) // store double up data



  const [server, setServer] = useState("europe"); // store server data
  const [rankedSelection, setRankedSelection] = useState("ranked"); // store ranked selection data

  const [championJson, setChampionJSON] = useState(null);
  const [currentChampionJson, setCurrentChampionJSON] = useState(null);
  const [tacticianJSON, setTacticianJSON] = useState(null);
  const [latestPatch, setLatestPatchVersion] = useState(null);

  // path to localhost / vercel

  const allData = 'http://localhost:4000/allData'; 
  const allDataVercel = 'https://tfttracker-server.vercel.app/allData'; 

  
  

  function getPlayerData(event) {  
    
    const [summonerName, tagLine] = input.split("#");


    if(!input.trim()){


      alert("Please enter a player name and tag!");
      return;
    }
    

    axios.get(allDataVercel, {params: {summonerName: summonerName, tagLine: tagLine, server: server}})
    .then(res => {
      setMatchList(res.data.matchList);
      setSummonerData(res.data.summonerData);
      setDoubleUpData(res.data.tftDoubleUpRankedData);
      setRankedData(res.data.tftRankedData);
    }).catch(error => {
      if (error.response && error.response.status === 429) {
        alert("Too many requests. Please wait and try again.");
      } else {
        console.log(error);
      }
    });

                 
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


           const Set13 = await fetch('https://ddragon.leagueoflegends.com/cdn/15.6.1/data/en_GB/tft-champion.json');

           

           const CurrentSet = await fetch('https://ddragon.leagueoflegends.com/cdn/'+latestPatchVersion[0]+'/data/en_GB/tft-champion.json');

           const tacticianResponse = await fetch('https://ddragon.leagueoflegends.com/cdn/'+latestPatchVersion[0]+'/data/en_GB/tft-tactician.json');

          

           if(!Set13.ok || !CurrentSet.ok || !tacticianResponse.ok){
             throw new Error(`Could not fetch the requested Set data: ${Set13.status} ${CurrentSet.status} ${tacticianResponse.status}`);
            
   
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
          //console.log(championIDPath);
          return championJson.data['Maps/Shipping/Map22/Sets/TFTSet13/Shop/' + championIDPath].image.full;
          
          
        }
       



      }catch (error){
         
        
       
        console.error("Error fetching champion image:", error);
      } 
      
        
       

    
      
      
    } 


    
  

  return (
    <div className="App">


          <header className= "App-header">
          
          <div className = "search">  <input type="puuid" placeholder="Search Player#Tag and select Region" onChange={e => setInput(e.target.value)}></input>
          <button className = "hover:scale-110 duration:500" onClick={getPlayerData}>Search</button>
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
       <img 
        className = "rounded-full border-4 border-orange-200 border-x-orange-400" 
        src={"https://ddragon.leagueoflegends.com/cdn/"+latestPatch+"/img/profileicon/" + summonerData.profileIconId +".png"}
        alt="Profile icon"
        width="100"
        height="100"/>
      
      
      {rankedData && rankedData.tier ? (
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
       
      
          {rankedData && rankedData.tier && rankedData.rank  ? (
      <p>
        {rankedData.tier} {rankedData.rank} {rankedData.leaguePoints} LP
      </p>
    ) : (
      <p> Unranked</p>
    )}
      
      <p> Wins: {rankedData && rankedData.wins ? rankedData.wins : 0}     </p>
      <p> Losses:  {rankedData && rankedData.losses ? rankedData.losses : 0}</p>
      
    

      
     

      {rankedData && (rankedData.wins || rankedData.losses) ? (
    <p>
      <p> Win Rate: {((rankedData.wins / (rankedData.wins + rankedData.losses)) * 100).toFixed(1)}%</p>      
      </p>
  
     ) : (
     <p>  Win Rate: {0} </p>
    )}


      {rankedData && (rankedData.wins || rankedData.losses) ?(
    <p>
      Games:  {(rankedData.wins) + (rankedData.losses)}
    </p>
  
    ) : (
     <p> Games: {0} </p>
    )}
  
     

      </div>
    </>
  ) : (
   
    console.log("No data available")
  )}
</>
         
             

       {/* {matchList.map((matchData, index) =>
  <div key={index}>



    <div className = "font-Montserrat text-yellow-600 mb-10">
      <p>{unixToDate(matchData.info.game_datetime)}</p>
      <p>Game Duration: {secondsToMinute(matchData.info.game_length)}</p>
      </div>

      <div >
         {matchData.info.participants.sort((a, b) => a.placement - b.placement).map((data) =>
      <div className =  "grid grid-cols-5 h-20  content-start font-Montserrat text-gray-800 ">
       

        <div className = "font-semibold font-montserrat ">{data.placement}</div>
        <div className = "flex justify-start"> {data.riotIdGameName}</div>
        <div className ='flex justify-start'>   
        <img className = "rounded-md border-4 border-orange-200 border-x-orange-400 h-16 w-16"
        src={"https://ddragon.leagueoflegends.com/cdn/"+latestPatch+"/img/tft-tactician/" + getTacticianImage(data.companion.item_ID)} 
        alt="Tactician image" 
         /> 
        </div>  
        <div class = "flex justify-start"> {secondsToMinute(data.time_eliminated)}</div>
        <div className = "flex flex-row flex-wrap items-center gap-1"> {data.units.map((units, unitIndex) => {
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
            })}</div>

        

        
    
      </div>
)}
       
        
       


        </div>
    
  </div>
)}
         */}
        



        <React.Fragment>
        
           {
             matchList.map((matchData, index) => 
               <React.Fragment key ={index}>
          
                
                 
                <div className = "matchInfo overflow-auto rounded-lg shadow">
                
                <div className = "font-montserrat text-center font-semibold text-gray-800 p-10">     
                <p> {unixToDate(matchData.info.game_datetime)} </p>
                <p>  Duration: {secondsToMinute(matchData.info.game_length)} </p>
                
                </div>
           
                

                <table className= "w-full " >
                  <thead class = "bg-gray-50 border-b-2 border-gray-200">
                    <tr className = "font-montserrat">
                      <th class = "w-5 p-3 text-sm font-montserrat font-[600] tracking-wide text-left">No.</th>
                      <th class = "w-5 p-3 text-sm font-montserrat font-[600] tracking-wide text-left">Tactician</th>
                      <th class = "w-20 p-3 text-sm font-montserrat font-[600] tracking-wide text-left">Player</th>
                      <th class = "w-20 p-3 text-sm font-montserrat font-[600] tracking-wide text-left">Elim</th>
                      <th class = "w-50 p-3 text-sm font-montserrat font-[600] tracking-wide text-left" >Units</th>
                    </tr>
                  </thead>

                  <tbody>
                {matchData.info.participants
            .sort((a, b) => a.placement - b.placement) // Sort participants by placement
            .map((data, pIndex) => (

              <tr class = {pIndex % 2 === 0 ? "bg-blue-100" : "bg-grey whitespace-nowrap" } key={pIndex}>
              <td className = "p-3 text-sm text-gray-700 whitespace-nowrap gap-4">{data.placement}</td>
              <td className = "p-3 text-sm text-gray-700 whitespace-nowrap gap-4"> 
                 <div >   
                  <img className ='rounded-md border-4 border-orange-200 border-x-orange-400 h-16 w-16' src={"https://ddragon.leagueoflegends.com/cdn/"+latestPatch+"/img/tft-tactician/" + getTacticianImage(data.companion.item_ID)} 
                alt="Tactician" 
                 /> </div>  
                
              </td>
              <td className = "p-3 text-sm text-gray-700 hover:underline whitespace-nowrap gap-4">
                
                
               {data.riotIdGameName}</td>
              <td class = "p-3 text-sm text-gray-700 whitespace-nowrap gap-4"> {secondsToMinute(data.time_eliminated)}</td>

              <td className = "p-3 text-sm text-gray-700 whitespace-nowrap gap-4">
              <div className = 'flex flex-wrap gap-4'>
              {data.units.map((units, unitIndex) => {
              const championImageSrc = units.character_id === 
              "TFT13_Sion" 
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
              


              let unitborder = "border-gray-400";


            switch (units.rarity) {
                    case 0:
                      unitborder = "border-gray-400"; // Gray
                      break;
                    case 1:
                      unitborder = "border-green-400"; // Green
                      break;
                    case 2:
                     unitborder= "border-blue-400"; // Blue
                      break;
                    case 4:
                      unitborder = "border-purple-500"; // Purple
                      break;
                    case 6:
                      unitborder = "border-yellow-400"; // Yellow/Gold
                      break;
                    default:
                      unitborder = "border-gray-400";
                  }

              let unitName = units.character_id;
                try {
                  if (units.character_id.startsWith("TFT14") && currentChampionJson) {
                    const champObj = currentChampionJson.data[
                      "Maps/Shipping/Map22/Sets/TFTSet14/Shop/" + units.character_id
                    ];
                    if (champObj && champObj.name) unitName  = champObj.name;
                  } else if (units.character_id.startsWith("TFT13") && championJson) {
                    const champObj = championJson.data[
                      "Maps/Shipping/Map22/Sets/TFTSet13/Shop/" + units.character_id
                    ];
                    if (champObj && champObj.name) unitName  = champObj.name;
                  }
                } catch (e) {
                  // fallback to character_id
                }
              
              return (
               

                  <div key={unitIndex} className="flex flex-col items-center">
 
    <div className="flex mb-1 select-none">
    {Array.from({ length: units.tier }).map((_, i) => (
        <span
          key={i}
          className={
            units.tier === 1
              ? "text-transparent"
              : units.tier === 2
              ? "text-gray-400"
              : units.tier === 3
              ? "text-yellow-400"
              : units.tier >= 4
              ? "text-sky-400"
              : "text-gray-400"
          }
        style={{ fontSize: "1.2rem", marginRight: "1px" }}
      > 

        
        ★
      </span>
    ))}
  </div>
  <img
    className={`rounded-md border-[5px] ${unitborder} h-32 w-32`}
    src={championImageSrc}
    alt={`${units.character_id}`}
    loading="lazy"
  />
  <span className="flex flex-row flex-wrap justify-center gap-1 mt-1">
  {units.itemNames && units.itemNames.length > 0 &&
    units.itemNames.map((itemName, idx) => (
      <img
        key={idx}
        src={`https://ddragon.leagueoflegends.com/cdn/${latestPatch}/img/tft-item/${itemName}.png`}
        alt={itemName}
        className="rounded-md border-5 w-8 h-8 inline-block"
        loading="lazy"
      />
    ))
  }
</span>
</div>

                
            
                

                
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
