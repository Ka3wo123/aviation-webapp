import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { Route, Routes } from 'react-router';
import { BrowserRouter } from 'react-router-dom';
import LoginForm from './components/authenticate/LoginForm';
import Users from './components/Users';
import RegistrationForm from './components/authenticate/RegistrationForm';
import AuthPage from './components/authenticate/Auth';
import 'bootstrap/dist/css/bootstrap.min.css';
import NotFound from './components/handler-pages/NotFound';


const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<App />}>          
          <Route path='/auth' element={<AuthPage/>} />
          <Route path='/register' element={<RegistrationForm />} />
          <Route path='/users' element={<Users />} />
          <Route path='/*' element={<NotFound></NotFound>} />
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();