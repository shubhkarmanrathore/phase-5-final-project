import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Navbar, Nav, NavDropdown, Form, FormControl, Button } from 'react-bootstrap';
import { NavLink, useHistory } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart } from '@fortawesome/free-solid-svg-icons';

function NavBar() {
  const history = useHistory();

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

  return (
    <Navbar bg="body-tertiary" expand="lg">
      <div className="container-fluid">
        <NavLink to="/" className="navbar-brand">Website</NavLink>
        <Navbar.Toggle aria-controls="navbarScroll" />
        <Navbar.Collapse id="navbarScroll">
          <Nav className="me-auto my-2 my-lg-0 navbar-nav-scroll" style={{ '--bs-scroll-height': '100px' }}>
            <Form className="d-flex" role="search">
              <FormControl type="search" placeholder="Search" aria-label="Search" className="me-2" />
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
