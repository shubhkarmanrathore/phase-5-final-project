import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Navbar, Nav, NavDropdown, Form, FormControl, Button } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';

function NavBar() {

  const handleSignout = () => {
    fetch('/signout', {
      method: 'GET',
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
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
          {/* <NavLink to="/" className="nav-link" activeClassName="active">Home</NavLink> */}
            <NavLink to="/signin" className="nav-link">Sign In</NavLink>
            <NavDropdown title="Options" id="navbarScrollingDropdown">
              <NavDropdown.Item href="#">Orders</NavDropdown.Item>
              <NavDropdown.Item href="#">Settings</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item onClick={handleSignout} href="#">Sign Out</NavDropdown.Item>
            </NavDropdown>
            {/* <Nav.Link href="#" disabled>Link</Nav.Link> */}
          </Nav>
          <Form className="d-flex" role="search">
            <FormControl type="search" placeholder="Search" aria-label="Search" className="me-2" />
            <Button variant="outline-success" type="submit">Search</Button>
          </Form>
        </Navbar.Collapse>
      </div>
    </Navbar>
  );
}

export default NavBar;
