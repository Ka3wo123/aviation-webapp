import './App.css';
import { Outlet, useLocation } from 'react-router';
import NavBar from './shared/Navbar';
import { Container } from 'react-bootstrap';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {

  const location = useLocation();
  const hiddenFooterPaths = ['/airports/map', '/flight/search'];
  const isFooterHidden = hiddenFooterPaths.includes(location.pathname);

  return (
    <>
      <NavBar />
      <ToastContainer position='top-right' autoClose={3000} hideProgressBar={false}/>
      <Outlet />

      {!isFooterHidden && (
        <footer className="bg-dark text-light py-3 text-center">
          <Container>
            <p>&copy; 2024 Aviation Explorer. All Rights Reserved.</p>
          </Container>
        </footer>
      )}
    </>
  );
}

export default App;
