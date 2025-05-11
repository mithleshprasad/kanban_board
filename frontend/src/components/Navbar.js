import React, { useContext } from 'react';
import { Navbar as BSNavbar, Nav, Container, Button, Form } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { ThemeContext } from '../App';

const Navbar = ({ loggedIn, onLogout }) => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useContext(ThemeContext);

  const handleLogout = () => {
    onLogout();
    navigate('/login');
  };

  return (
    <BSNavbar bg={theme === 'dark' ? 'dark' : 'light'} variant={theme === 'dark' ? 'dark' : 'light'} expand="lg">
      <Container>
        <BSNavbar.Brand as={Link} to="/">Kanban Board</BSNavbar.Brand>
        <BSNavbar.Toggle aria-controls="basic-navbar-nav" />
        <BSNavbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            {loggedIn && (
              <>
                <Nav.Link as={Link} to="/boards">Boards</Nav.Link>
              </>
            )}
          </Nav>
          <Nav>
            <Form.Check 
              type="switch"
              id="theme-switch"
              label={theme === 'dark' ? '🌙' : '☀️'}
              checked={theme === 'dark'}
              onChange={toggleTheme}
              className="me-3 mt-2"
            />
            {loggedIn ? (
              <Button variant="outline-light " className='text-danger' onClick={handleLogout}>Logout</Button>
            ) : (
              <>
                <Nav.Link as={Link} to="/login">Login</Nav.Link>
                <Nav.Link as={Link} to="/register">Register</Nav.Link>
              </>
            )}
          </Nav>
        </BSNavbar.Collapse>
      </Container>
    </BSNavbar>
  );
};

export default Navbar;