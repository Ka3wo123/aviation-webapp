import React, { useState } from "react";
import LoginForm from "./LoginForm";
import RegistrationForm from "./RegistrationForm";
import '../../styles/AuthPage.css'; // Optional: To style the parent component if needed
import { Image } from "react-bootstrap";

const AuthPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="auth-page">
      <div className="background">       
      </div>
      <div className="form-container">
        <div>
          <LoginForm />
        </div>        
        <div>
          <RegistrationForm />
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
