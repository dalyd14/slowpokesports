import React from 'react'
import { Link } from 'react-router-dom';
import { Navbar, Nav } from 'react-bootstrap';

import Auth from '../../utils/auth'

const AppNavbar = ({ companyName, loggedIn }) => {

    const handleLogout = () => {
        Auth.logout()
    }

    return (
        <Navbar bg="light" variant="light">
            <Navbar.Brand as={Link} to="/">
                {companyName ? companyName : "Default"}
            </Navbar.Brand>
            {loggedIn && 
                <Nav className="mr-auto">
                    <Nav.Link as={Link} to="/dashboard">
                        Dashboard
                    </Nav.Link>
                    <Nav.Link as={Link} to="/products">
                        Products
                    </Nav.Link>
                    <Nav.Link as={Link} to="/edit">
                        Edit
                    </Nav.Link>
                    {companyName === 'Effikas' &&
                        <Nav.Link as={Link} to="/addcompany">
                            Add Company
                        </Nav.Link>                    
                    }
                </Nav>          
            }
            <Nav className="ml-auto" inline="true">
                {!loggedIn ? 
                    <>
                        <Nav.Link as={Link} to="/login">
                            Login
                        </Nav.Link>
                        <Nav.Link as={Link} to="/register">
                            Register
                        </Nav.Link>
                    </>
                    :
                    <>
                        <Nav.Link as={Link} to="/settings">
                            Settings
                        </Nav.Link>
                        <Nav.Link onClick={handleLogout}>
                            Logout
                        </Nav.Link>
                    </>
                }
            </Nav>
        </Navbar>        
    )
}

export default AppNavbar