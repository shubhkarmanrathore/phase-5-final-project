import React, { useState, useEffect } from 'react';
import { NavLink, useHistory } from 'react-router-dom';

function SignIn() {
  const [login, setLogin] = useState({
    username: '',
    password: ''
  });
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const history = useHistory();

  useEffect(() => {
    fetch('/check_session')
      .then((response) => {
        if (response.status === 200) {
          setIsLoggedIn(true);
        }
      })
      .catch((error) => {
        console.error('Session check error:', error);
      });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLogin({ ...login, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    fetch('/signin', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(login),
    })
      .then((response) => {
        if (response.status === 200) {
          history.push('/');
        } else {
          alert("Incorrect username or password.")
          console.error('Sign-in failed.');
        }
      })
      .catch((error) => {
        console.error('Sign-in error:', error);
      });
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card">
            <div className="card-body">
              {isLoggedIn ? (
                <>
                  <h2 className="card-title">Already Logged In</h2>
                  <p>You are already signed in.</p>
                  <NavLink to="/" className="btn btn-primary">
                    Start Shopping
                  </NavLink>
                </>
              ) : (
                <>
                  <h2 className="card-title">Sign In</h2>
                  <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                      <label htmlFor="username" className="form-label">Username:</label>
                      <input
                        type="text"
                        id="username"
                        name="username"
                        value={login.username}
                        onChange={handleChange}
                        className="form-control"
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="password" className="form-label">Password:</label>
                      <input
                        type="password"
                        id="password"
                        name="password"
                        value={login.password}
                        onChange={handleChange}
                        className="form-control"
                        required
                      />
                    </div>
                    <button type="submit" className="btn btn-primary">Sign In</button>
                  </form>
                  <p className="mt-3">
                    Don't have an account? <NavLink to="/signup">Sign Up</NavLink>
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignIn;
