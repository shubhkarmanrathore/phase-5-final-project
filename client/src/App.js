import logo from './logo.svg';
import './App.css';
import {useEffect, useState} from 'react'

function App() {
  const [data, setData] = useState("")

  useEffect(() => {
    fetch("/members").then(res=> res.json())
    .then(data => {
      setData(data) 
      console.log(data)})
  }, [])
  return (
    <div className="App">
      
    </div>
  );
}

export default App;
