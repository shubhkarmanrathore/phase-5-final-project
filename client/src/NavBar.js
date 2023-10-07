import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Navbar, Nav, NavDropdown, Form, FormControl, Button } from 'react-bootstrap';
import { NavLink, useHistory } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart } from '@fortawesome/free-solid-svg-icons';

function NavBar({ onSearch }) {
  const history = useHistory();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSignout = () => {
    fetch('/signout', {
      method: 'GET',
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        history.push('/');
      })
      .catch((error) => {
        console.error('Logout error:', error);
      });
  };

  const handleSearchInputChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    history.push('/')
    onSearch(searchQuery);
  };

  return (
    <Navbar bg="body-tertiary" expand="lg">
      <div className="container-fluid">
        <NavLink to="/" className="navbar-brand">ShopSmart</NavLink>
        <Navbar.Toggle aria-controls="navbarScroll" />
        <Navbar.Collapse id="navbarScroll">
          <Nav className="me-auto my-2 my-lg-0 navbar-nav-scroll" style={{ '--bs-scroll-height': '100px' }}>
            <Form className="d-flex" onSubmit={handleSubmit}>
              <FormControl
                type="search"
                placeholder="Search"
                aria-label="Search"
                className="me-2"
                value={searchQuery}
                onChange={handleSearchInputChange}
              />
              <Button variant="outline-success" type="submit">Search</Button>
            </Form>
          </Nav>
          <Nav.Link as={NavLink} to="/signin" className="nav-link ms-2">Sign In</Nav.Link>
          <Nav className="my-2 my-lg-0">
            <Nav.Link as={NavLink} to="/cart" className="nav-link">
              <FontAwesomeIcon icon={faShoppingCart} />
            </Nav.Link>
            <NavDropdown title="Options" id="navbarScrollingDropdown" className="ms-2">
              <NavDropdown.Item href="/my_orders">My Orders</NavDropdown.Item>
              <NavDropdown.Item href="#">My Account</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item onClick={handleSignout} style={{ paddingRight: '20px' }}>Sign Out</NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </div>
    </Navbar>
  );
}

export default NavBar;