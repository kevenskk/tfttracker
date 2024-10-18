import logo from './logo.svg';
import './App.css';
import axios from 'axios';
import React, {useState} from 'react';






function App() {


  const [message, setMessage] = useState("")
  const [summonerName, setSummonerName] = useState("")  

  function callAPI() {  
    

    const [summonerName, tagLine] = summonerName.split("#");
    
    axios.get('https://tfttracker-server.vercel.app/testAPI', {params: {summonerName: summonerName, tagLine: tagLine}})  
    .then(res => setMessage(res.data))
    .catch(error => console.log(error))

    
  }



  return (
    <div className="App">
      <header className="App-header">
       
       <input type="text" placeholder="Enter your name" />  
       <button onClick={callAPI}>Call API</button>
       <p> {message} </p>
      </header>
    </div>
  );
}

export default App;
