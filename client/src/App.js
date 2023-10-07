import './App.css';
import React, { useState, useEffect } from 'react';
import HomePage from './HomePage';
import NavBar from './NavBar';
import Product from './Product';
import SignIn from './SignIn';
import Cart from './Cart';
import { Switch, Route } from 'react-router-dom';
import SignUp from './SignUp';
import Checkout from './Checkout';
import MyOrders from './MyOrders';

function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch('/products')
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
      });
  }, []);

  const handleSearch = (query) => {
    setSearchQuery(query);

    const results = products.filter((product) =>
      product.title.toLowerCase().includes(query.toLowerCase())
    );
    setSearchResults(results);
  };

  return (
    <div className="App">
      <NavBar onSearch={handleSearch} />
      <Switch>
        <Route exact path="/">
          <HomePage products={searchQuery ? searchResults : products} />
        </Route>
        <Route path="/product/:productId"><Product/></Route>
        <Route path="/signin"><SignIn/></Route>
        <Route path="/signup"><SignUp/></Route>
        <Route path="/cart"><Cart/></Route>
        <Route path="/checkout"><Checkout/></Route>
        <Route path="/my_orders"><MyOrders/></Route>
      </Switch>
    </div>
  );
}

export default App;
