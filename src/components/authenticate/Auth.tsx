import React, { useState } from "react";
import LoginForm from "./LoginForm";
import RegistrationForm from "./RegistrationForm";
import '../../styles/AuthPage.css';

const AuthPage: React.FC = () => {

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
