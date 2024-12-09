import React, { useState, ChangeEvent, FormEvent } from "react";
import { Button, Form, Toast, ToastContainer } from "react-bootstrap";
import '../../styles/Form.css';
import AuthService from "../../services/AuthService";
import { toast } from "react-toastify";
import { useLocation, useNavigate } from "react-router";
import { Link } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

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
        const { access_token } = response.data;
        const decoded: { roles?: string } = jwtDecode(access_token);
        if (decoded.roles?.includes('ADMIN')) {
          window.open('/admin-dashboard', '_blank')
        }
        toast.success("Login successful!");
        const from = location.state?.from || "/";
        navigate(from);

      },
      error: (err: any) => {
        if (err.response?.data?._embedded?.errors) {
          const errorMessage = err.response.data._embedded.errors[0]?.message + ". Contact with administrator for more information." || "An error occurred";
          toast.error(errorMessage);
        } else if (err.status === 401) {
          toast.error("Invalid credentials");
        } else if (err.status === 500) {
          toast.error("Internal server error");
        } else {
          toast.error("An unexpected error occurred");
        }
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
            data-testid="email-input"
            type="email"
            value={email}
            onChange={handleEmailChange}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control
            data-testid="password-input"
            type="password"
            value={password}
            onChange={handlePasswordChange}
            required
          />
        </Form.Group>
        <Link to={'/forgot-password'} style={{ color: '#fff', textDecoration: 'none' }}>Forgot password?</Link>

        <Button data-testid="submit-button" variant="primary" type="submit">
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
