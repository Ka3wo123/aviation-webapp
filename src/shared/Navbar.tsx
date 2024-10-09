import { useEffect, useState } from 'react';
import { Navbar, Nav, Container, Button, Dropdown } from 'react-bootstrap';
import logo from '../assets/images/aviation_logo.png';
import '../styles/Navbar.css';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { validateJWTToken } from '../utils/CheckToken';

const NavBar = () => {
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

    useEffect(() => {
        const checkLogin = () => {
            const isValid = validateJWTToken();
            setIsLoggedIn(isValid);
        };

        checkLogin();
    }, [isLoggedIn]);



    const handleLogout = () => {
        localStorage.removeItem("accessToken");
        setIsLoggedIn(false);
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
                        <Dropdown as={Nav.Item}>
                            <Dropdown.Toggle as={Nav.Link} className='text-light'>Airports</Dropdown.Toggle>
                            <Dropdown.Menu className="custom-dropdown-menu">
                                <Dropdown.Item href="/airports/list" className='text-light'>Airport List</Dropdown.Item>
                                <Dropdown.Item href="/airports/map" className='text-light'>Airport Map</Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>

                        <Dropdown as={Nav.Item} >
                            <Dropdown.Toggle as={Nav.Link} className='text-light'>Airlines</Dropdown.Toggle>
                            <Dropdown.Menu className="custom-dropdown-menu">
                                <Dropdown.Item href="/airlines/list" className='text-light'>Airline List</Dropdown.Item>
                                <Dropdown.Item href="/airlines/fleet" className='text-light'>Fleet Information</Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>

                        <Dropdown as={Nav.Item}>
                            <Dropdown.Toggle as={Nav.Link} className='text-light'>Flights</Dropdown.Toggle>
                            <Dropdown.Menu className="custom-dropdown-menu">
                                <Dropdown.Item href="/flights/tracker" className='text-light'>Flight Tracker</Dropdown.Item>
                                <Dropdown.Item href="/flights/schedules" className='text-light'>Flight Schedules</Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>                        
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
