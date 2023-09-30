import './App.css';
import HomePage from './HomePage'
import NavBar from './NavBar';
import Products from './Products'
import SignIn from './SignIn'
import Cart from './Cart'
import { Switch, Route } from 'react-router-dom';
import SignUp from './SignUp';

function App() {
  return (
    <div className="App">
      <NavBar/>
      <Switch>
        <Route exact path="/"><HomePage/></Route>
        <Route path="/products"><Products/></Route>
        <Route path="/signin"><SignIn/></Route>
        <Route path="/signup"><SignUp/></Route>
        <Route path="/cart"><Cart/></Route>
      </Switch>
    </div>
  );
}

export default App;
