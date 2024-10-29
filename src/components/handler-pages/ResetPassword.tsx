import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import authService from '../../services/AuthService';
import '../../styles/ResetPassword.css'; // Import the CSS file

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

  const handleResetPassword = async () => {
    if (email && newPassword) {
      // Here you would call the appropriate service to reset the password
      try {
        // Example: await authService.resetPassword(email, newPassword, token);
        setMessage('Your password has been reset successfully.');
        // Optionally, navigate to another page after successful reset
        navigate('/');
      } catch (error) {
        console.error("Error resetting password:", error);
        setMessage('Failed to reset password. Please try again.');
      }
    } else {
      setMessage('Please fill in all fields.');
    }
  };

  return (
    <div className="reset-password-container">
      <h2>Reset Your Password</h2>
      {email && <p className="email">Your email: {email}</p>}
      {!email && <p>Please provide a valid email to reset your password.</p>}
      {isTokenValid === false && <p>Your token is invalid. Please request a new one.</p>}
      
      {isTokenValid && (
        <div className="input-container">
          <input
            type="password"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <button onClick={handleResetPassword}>Reset Password</button>
          {message && <p>{message}</p>}
        </div>
      )}
    </div>
  );
};

export default ResetPassword;
