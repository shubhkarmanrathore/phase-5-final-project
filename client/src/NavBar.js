import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Navbar, Nav, NavDropdown, Form, FormControl, Button, Modal } from 'react-bootstrap';
import { NavLink, useHistory } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart } from '@fortawesome/free-solid-svg-icons';

function NavBar({ onSearch, onDeleteAccount }) {
  const history = useHistory();
  const [searchQuery, setSearchQuery] = useState('');
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [userId, setUserId] = useState(null);
  useEffect(() => {
    fetch('/check_session')
      .then((response) => {
        if (response.status === 200) {
          return response.json();
        } else {
          throw new Error('User not logged in');
        }
      })
      .then((data) => {
        const fetchedUserId = data.id;
        setUserId(fetchedUserId);
      })
      .catch((error) => {
        console.error('Fetch user info error:', error);
      });
  }, []);

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

  const handleDeleteAccount = () => {
    setShowConfirmationModal(true);
  };

  const handleConfirmDelete = () => {
    if (userId) {
      fetch(`/users/${userId}`, {
        method: 'DELETE',
      })
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
          history.push('/');
        })
        .catch((error) => {
          console.error('Delete account error:', error);
        });
    }

    setShowConfirmationModal(false);
  };

  const handleCancelDelete = () => {
    setShowConfirmationModal(false);
  };

  const handleSearchInputChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    history.push('/');
    onSearch(searchQuery);
  };

  return (
    <div>
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
                <NavDropdown.Item onClick={handleDeleteAccount}>Delete Account</NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item onClick={handleSignout} style={{ paddingRight: '20px' }}>Sign Out</NavDropdown.Item>
              </NavDropdown>
            </Nav>
          </Navbar.Collapse>
        </div>
      </Navbar>
      <Modal show={showConfirmationModal} onHide={handleCancelDelete}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete your account?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCancelDelete}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleConfirmDelete}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default NavBar;
