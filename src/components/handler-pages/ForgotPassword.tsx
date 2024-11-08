import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../../services/AuthService';
import styles from '../../styles/ForgotPassword.module.css';
import { toast } from 'react-toastify';

const ForgotPassword = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState<string>('');

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const response = authService.sendResetPasswordRequest(email);
        
        localStorage.setItem("receiverEmail", email);

        response.subscribe({
            next: () => toast.success("Password recovery link was sent to your inbox"),
            error: (err) => {
                if (err.status === 404) {
                    toast.error("The submitted credentials are not connected to an existing user.");
                } else {
                    toast.error("Failed to send password reset email. Please try again.");
                }
            }
        });
    };

    return (
        <div className={styles.main}>
            <div className={styles.container}>
                <h2 className={styles.heading}>Forgot Password</h2>
                <p>To recover your password, please enter your account email address below and confirm.</p>
                <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.inputContainer}>
                        <label htmlFor="email" className={styles.label}>Email:</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className={styles.input}
                        />
                    </div>
                    <button type="submit" className={styles.button}>Send Reset Email</button>
                </form>
            </div>
        </div>
    );
};


export default ForgotPassword;
