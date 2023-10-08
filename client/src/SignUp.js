import React from 'react';
import { Container, Form, Button } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';

function SignUp() {
  const formik = useFormik({
    initialValues: {
      name: '',
      email: '',
      username: '',
      password: '',
      address: '',
      phone_number: '',
      payment_card: '',
    },
    validationSchema: Yup.object({
      name: Yup.string().required('Name is required'),
      email: Yup.string()
        .email('Invalid email address')
        .required('Email is required'),
      username: Yup.string().required('Username is required'),
      password: Yup.string().required('Password is required'),
      address: Yup.string().required('Address is required'),
      phone_number: Yup.string()
        .matches(/^\d{10}$/, 'Phone number must be 10 digits')
        .required('Phone number is required'),
      payment_card: Yup.string()
        .matches(/^\d{16}$/, 'Payment card must be 16 digits')
        .required('Payment card is required. Do not input your actual card no.'),
    }),
    onSubmit: (values) => {
      fetch('/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      })
        .then((response) => {
          if (response.status === 201) {
            alert('Signup successful. Please sign in to start shopping');
            formik.resetForm();
          } else {
            alert('Error occurred while signing up.');
          }
          return response.json();
        })
        .then((data) => {
          console.log('Registration response:', data);
        })
        .catch((error) => {
          console.error('Registration error:', error);
        });
    },
  });

  return (
    <Container className="mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card">
            <div className="card-body">
              <h2 className="card-title">Sign Up</h2>
              <Form onSubmit={formik.handleSubmit}>
                <Form.Group controlId="name">
                  <Form.Label>Name:</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    {...formik.getFieldProps('name')}
                  />
                  {formik.touched.name && formik.errors.name ? (
                    <div className="error">{formik.errors.name}</div>
                  ) : null}
                </Form.Group>

                <Form.Group controlId="email">
                  <Form.Label>Email:</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    {...formik.getFieldProps('email')}
                  />
                  {formik.touched.email && formik.errors.email ? (
                    <div className="error">{formik.errors.email}</div>
                  ) : null}
                </Form.Group>

                <Form.Group controlId="username">
                  <Form.Label>Username:</Form.Label>
                  <Form.Control
                    type="text"
                    name="username"
                    {...formik.getFieldProps('username')}
                  />
                  {formik.touched.username && formik.errors.username ? (
                    <div className="error">{formik.errors.username}</div>
                  ) : null}
                </Form.Group>

                <Form.Group controlId="password">
                  <Form.Label>Password:</Form.Label>
                  <Form.Control
                    type="password"
                    name="password"
                    {...formik.getFieldProps('password')}
                  />
                  {formik.touched.password && formik.errors.password ? (
                    <div className="error">{formik.errors.password}</div>
                  ) : null}
                </Form.Group>

                <Form.Group controlId="address">
                  <Form.Label>Address:</Form.Label>
                  <Form.Control
                    type="text"
                    name="address"
                    {...formik.getFieldProps('address')}
                  />
                  {formik.touched.address && formik.errors.address ? (
                    <div className="error">{formik.errors.address}</div>
                  ) : null}
                </Form.Group>

                <Form.Group controlId="phone_number">
                  <Form.Label>Phone Number:</Form.Label>
                  <Form.Control
                    type="text"
                    name="phone_number"
                    {...formik.getFieldProps('phone_number')}
                  />
                  {formik.touched.phone_number && formik.errors.phone_number ? (
                    <div className="error">{formik.errors.phone_number}</div>
                  ) : null}
                </Form.Group>

                <Form.Group controlId="payment_card">
                  <Form.Label>Payment Card:</Form.Label>
                  <Form.Control
                    type="text"
                    name="payment_card"
                    {...formik.getFieldProps('payment_card')}
                  />
                  {formik.touched.payment_card && formik.errors.payment_card ? (
                    <div className="error">{formik.errors.payment_card}</div>
                  ) : null}
                </Form.Group>

                <Button variant="primary" type="submit" className="mt-3">
                  Sign Up
                </Button>
              </Form>
              <p className="mt-3">
                Already have an account?{' '}
                <NavLink to="/signin">Sign In</NavLink>
              </p>
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
}

export default SignUp;
