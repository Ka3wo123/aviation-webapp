import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../../services/AuthService';

const ForgotPassword = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState<string>('');
    const [message, setMessage] = useState<string>('');
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);
        setMessage('');

        try {
            const response = authService.sendResetPasswordRequest(email);
            localStorage.setItem("receiverEmail", email);
            response.subscribe();
            setMessage('Password reset email sent successfully. Please check your inbox.');
        } catch (err) {
            console.error(err);
            setError('Failed to send password reset email. Please check the email address.');
        }
    };

    return (
        <div>
            <h2>Forgot Password</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="email">Email:</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">Send Reset Email</button>
            </form>
            {message && <p style={{ color: 'green' }}>{message}</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
    );
};

export default ForgotPassword;
