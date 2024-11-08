import React, { useState, ChangeEvent, FormEvent } from "react";
import { Button, Form, Toast, ToastContainer } from "react-bootstrap";
import '../../styles/Form.css';
import AuthService from "../../services/AuthService";
import { toast } from "react-toastify";
import { useLocation, useNavigate } from "react-router";
import { Link } from "react-router-dom";

const LoginForm: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [showToast, setShowToast] = useState<boolean>(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    AuthService.login(email, password).subscribe({
      next: (response) => {
        if (response === 200) {
          toast.success("Login successful!");
          const from = location.state?.from || "/";
          navigate(from);
        } else if (response === 401) {
          toast.error("Invalid credentials");
        } else if (response === 500) {
          toast.error("Internal server error");
        }
      },
      error: (err: unknown) => {
        console.log(err);
      }
    });
  };

  return (
    <div className="form">
      <h2 className="header">Login</h2>
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            value={email}
            onChange={handleEmailChange}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            value={password}
            onChange={handlePasswordChange}
            required
          />
        </Form.Group>
        <Link to={'/forgot-password'} style={{color: '#fff', textDecoration: 'none'}}>Forgot password?</Link>

        <Button variant="primary" type="submit">
          Login
        </Button>
      </Form>
      <ToastContainer className="toast-container">
        <Toast
          onClose={() => setShowToast(false)}
          show={showToast}
          delay={3000}
          autohide
          bg="danger"
        >
          <Toast.Header>
            <strong className="me-auto">Error</strong>
          </Toast.Header>
          <Toast.Body>Invalid credentials</Toast.Body>
        </Toast>
      </ToastContainer>
    </div>
  );
};

export default LoginForm;
