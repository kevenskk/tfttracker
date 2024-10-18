import logo from './logo.svg';
import './App.css';
import axios from 'axios';
import React, {useState} from 'react';






function App() {


  const [message, setMessage] = useState("")

  function callAPI() {  

    axios.get('https://tfttracker-server.vercel.app/testAPI')
    .then(res => setMessage(res.data))
    .catch(error => console.log(error))

    
  }



  return (
    <div className="App">
      <header className="App-header">
       

       <button onClick={callAPI}>Call API</button>
       <p> {message} </p>
      </header>
    </div>
  );
}

export default App;
