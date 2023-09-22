import './App.css';
import HomePage from './HomePage'
import NavBar from './NavBar';
import Products from './Products'
import SignIn from './SignIn'
import Cart from './Cart'
import {useEffect, useState} from 'react'
import { Switch, Route } from 'react-router-dom'

function App() {
  
  return (
    <div className="App">
      <NavBar/>
      <Switch>
        <Route exact path = "/"><HomePage/></Route>
        <Route exact path = "/"><Products/></Route>
        <Route exact path = "/"><SignIn/></Route>
        <Route exact path = "/"><Cart/></Route>
      </Switch>
    </div>
  );
}

export default App;
