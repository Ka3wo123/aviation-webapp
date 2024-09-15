import React, { useState } from 'react';
import axios from 'axios';
import '../styles/Login.css'; // Assuming you will create a CSS file for styling

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = async (e: any) => {
        console.log(email + " " + password)
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:8083/login',
                {

                    username: email,
                    password
                });
            // Handle success (e.g., storing JWT token, redirecting, etc.)
            localStorage.setItem('accessToken', response.data.access_token);
            console.log('Login successful:', response.data);
        } catch (err) {
            setError('Invalid email or password');
        }
    };

    return (
        <div className="login-container">
            <form className="login-form" onSubmit={handleLogin}>
                <h2>Login</h2>
                {error && <p className="error">{error}</p>}
                <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" className="login-btn">Login</button>
            </form>
        </div>
    );
};

export default Login;
