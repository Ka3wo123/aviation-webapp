import { useEffect, useState } from 'react';
import { Navbar, Nav, Container, Button, Dropdown } from 'react-bootstrap';
import logo from '../assets/images/aviation_logo.png';
import '../styles/Navbar.css';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { validateJWTToken } from '../utils/CheckToken';
import { getEmailFromToken } from '../utils/ExtractEmail';

const NavBar = () => {
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
    const [email, setEmail] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const checkLogin = () => {
            const isValid = validateJWTToken();
            setEmail(getEmailFromToken());
            setIsLoggedIn(isValid);
        };

        checkLogin();
    }, [isLoggedIn]);

    const handleLogout = () => {
        localStorage.removeItem("accessToken");
        setIsLoggedIn(false);
        navigate('/');
        toast.success("You are logged out");
    };

    return (
        <Navbar bg="dark" expand="lg" collapseOnSelect>
            <Container>
                <Navbar.Brand href="/">
                    <img src={logo}
                        width="40"
                        height="40"
                        className="d-inline-block align-top"
                        style={{
                            borderRadius: '50%'
                        }}
                        alt='Aviation logo' />
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        <Nav.Item>
                            <Link to={`/airlines`} className='nav-link text-light'>Airlines</Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Link to={`/airports/map`} className='nav-link text-light'>Airports map</Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Link to={`/flight/search`} className='nav-link text-light'>Flights search</Link>
                        </Nav.Item>

                        {isLoggedIn &&
                            <Nav.Item>
                                <Link to={`/user/flights/${email}`} className='nav-link text-light'>Your flights</Link>
                            </Nav.Item>
                        }
                    </Nav>

                    <Nav>
                        {isLoggedIn ? (
                            <Nav.Item>
                                <Button variant="outline-light" onClick={handleLogout}>Logout</Button>
                            </Nav.Item>

                        ) : (
                            <Nav.Item>
                                <Link to="/auth" style={{ textDecoration: 'none' }}>
                                    <Button variant="outline-light">Login/Signup</Button>
                                </Link>
                            </Nav.Item>
                        )}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default NavBar;
