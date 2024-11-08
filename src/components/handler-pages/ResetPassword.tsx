import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import authService from '../../services/AuthService';
import { Form, Button } from 'react-bootstrap';
import '../../styles/ResetPassword.css';
import userService from '../../services/UserService';
import { error } from 'console';
import { toast } from 'react-toastify';

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [isTokenValid, setIsTokenValid] = useState<boolean | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [newPassword, setNewPassword] = useState<string>('');
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    const emailFromStorage = localStorage.getItem("receiverEmail");
    setEmail(emailFromStorage);

    const checkTokenValidity = () => {
      if (emailFromStorage && token) {
        const subscription = authService.getTokenByEmail(emailFromStorage).subscribe({
          next: (response) => {
            if (response) {
              setIsTokenValid(true);
            } else {
              setIsTokenValid(false);
              navigate('/');
            }
          },
          error: (err) => {
            console.error("Error checking token:", err);
            setIsTokenValid(false);
            navigate('/');
          },
        });

        return () => subscription.unsubscribe();
      }
    };

    checkTokenValidity();
  }, [token, navigate]);

  const handleResetPassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    userService.setNewPassword(email!, newPassword).subscribe({
      next: () => navigate('/'),
      error: (err) => toast.error(err.message)
    });
  };


  return (
    <div className="reset-password-container">
      <h2>Password Recovery</h2>
      {isTokenValid && (
        <Form className="input-container" onSubmit={handleResetPassword}>
          <Form.Group controlId="formBasicEmail">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              value={email || ''}
              readOnly
            />
          </Form.Group>
          <Form.Group controlId="formBasicPassword">
            <Form.Label>New Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </Form.Group>
          <Button variant="primary" type="submit">Reset Password</Button>
          {message && <p>{message}</p>}
        </Form>
      )}
    </div>
  );
};

export default ResetPassword;
